import os
import time
import psycopg2
from prometheus_client import start_http_server, Gauge

DB_HOST = os.environ.get("DB_HOST", "localhost")
DB_PORT = int(os.environ.get("DB_PORT", "5432"))
DB_NAME = os.environ.get("DB_NAME", "analytics")
DB_USER = os.environ.get("DB_USER", "postgres")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "postgres")

gauge_events = Gauge('rtap_events_raw_count', 'Count of rows in events_raw')

def get_conn():
    return psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
    )

def tick():
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("select count(*) from events_raw")
            (count,) = cur.fetchone()
            gauge_events.set(count)
            print(f"[pipeline] events_raw count = {count}")

if __name__ == "__main__":
    # Prometheus metrics on port 9100 inside the container
    start_http_server(9100)
    print("[pipeline] starting heartbeat loop...")
    while True:
        try:
            tick()
        except Exception as e:
            print(f"[pipeline] error: {e}")
        time.sleep(30)
