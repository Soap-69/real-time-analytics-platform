import os
import time
import psycopg2
from contextlib import closing
from prometheus_client import start_http_server, Gauge

DB_HOST = os.environ.get("DB_HOST", "localhost")
DB_PORT = int(os.environ.get("DB_PORT", "5432"))
DB_NAME = os.environ.get("DB_NAME", "analytics")
DB_USER = os.environ.get("DB_USER", "postgres")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "postgres")

# Prometheus gauges (optional, nice for Grafana later)
g_events_raw = Gauge('rtap_events_raw_count', 'Count of rows in events_raw')
g_etl_last_run_ok = Gauge('rtap_etl_last_run_ok', '1 if last ETL cycle succeeded, else 0')

def get_conn():
    return psycopg2.connect(
        host=DB_HOST, port=DB_PORT, dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD
    )

def count_events_raw(conn):
    with conn.cursor() as cur:
        cur.execute("select count(*) from events_raw;")
        (n,) = cur.fetchone()
        return n

def upsert_metric(conn, metric_date, metric_name, metric_value):
    """
    Insert or update a metric value for a given date.
    """
    sql = """
          insert into metrics_daily (metric_date, metric_name, metric_value)
          values (%s, %s, %s)
              on conflict (metric_date, metric_name)
    do update set metric_value = excluded.metric_value; \
          """
    with conn.cursor() as cur:
        cur.execute(sql, (metric_date, metric_name, metric_value))

def recompute_metrics_for_date(conn, date_str):
    """
    Recompute daily metrics for a given date (YYYY-MM-DD).
    Metrics:
      - EVENTS_TOTAL: total events that occurred that day
      - DAU: distinct users with a 'login' event that day
    """
    with conn.cursor() as cur:
        # total events for the date
        cur.execute(
            """
            select count(*)
            from events_raw
            where occurred_at::date = %s::date;
            """,
            (date_str,),
        )
        (events_total,) = cur.fetchone()

        # distinct users who logged in that day (DAU)
        cur.execute(
            """
            select count(distinct user_id)
            from events_raw
            where occurred_at::date = %s::date
              and event_type = 'login'
              and user_id is not null and user_id <> '';
            """,
            (date_str,),
        )
        (dau,) = cur.fetchone()

    upsert_metric(conn, date_str, "EVENTS_TOTAL", events_total)
    upsert_metric(conn, date_str, "DAU", dau)

def etl_cycle():
    """
    Run one ETL cycle:
      - Update raw count gauge
      - Recompute metrics for TODAY and YESTERDAY (safe window)
    """
    with closing(get_conn()) as conn:
        conn.autocommit = False
        total_raw = count_events_raw(conn)
        g_events_raw.set(total_raw)

        # Recompute today and yesterday for safety
        with conn.cursor() as cur:
            cur.execute("select current_date;")
            (today,) = cur.fetchone()
            cur.execute("select current_date - interval '1 day';")
            (yesterday,) = cur.fetchone()

        recompute_metrics_for_date(conn, str(today))
        recompute_metrics_for_date(conn, str(yesterday))
        conn.commit()

def main_loop():
    # expose Prometheus metrics on 9100 inside the container
    start_http_server(9100)
    print("[pipeline] ETL loop starting...")
    while True:
        try:
            etl_cycle()
            g_etl_last_run_ok.set(1)
            print("[pipeline] ETL ok")
        except Exception as e:
            g_etl_last_run_ok.set(0)
            print(f"[pipeline] ETL error: {e}")
        time.sleep(30)  # run every 30s

if __name__ == "__main__":
    main_loop()
