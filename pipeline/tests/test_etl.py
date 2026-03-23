"""
Unit tests for the ETL pipeline.
Uses mock DB connections — no real PostgreSQL required.
"""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "app"))

from unittest.mock import MagicMock, call, patch
import pytest

from main import upsert_metric, recompute_metrics_for_date, count_events_raw


class TestCountEventsRaw:
    def test_returns_count(self):
        conn = MagicMock()
        cursor = conn.cursor.return_value.__enter__.return_value
        cursor.fetchone.return_value = (42,)

        result = count_events_raw(conn)

        assert result == 42
        cursor.execute.assert_called_once_with("select count(*) from events_raw;")


class TestUpsertMetric:
    def test_executes_upsert_sql(self):
        conn = MagicMock()
        cursor = conn.cursor.return_value.__enter__.return_value

        upsert_metric(conn, "2024-01-01", "DAU", 99)

        args = cursor.execute.call_args
        sql, params = args[0]
        assert "insert into metrics_daily" in sql.lower()
        assert "on conflict" in sql.lower()
        assert params == ("2024-01-01", "DAU", 99)

    def test_called_with_correct_params(self):
        conn = MagicMock()
        cursor = conn.cursor.return_value.__enter__.return_value

        upsert_metric(conn, "2024-06-15", "EVENTS_TOTAL", 1000)

        _, params = cursor.execute.call_args[0]
        assert params[0] == "2024-06-15"
        assert params[1] == "EVENTS_TOTAL"
        assert params[2] == 1000


class TestRecomputeMetricsForDate:
    def _make_conn(self, events_total, dau):
        conn = MagicMock()
        cursor = conn.cursor.return_value.__enter__.return_value
        cursor.fetchone.side_effect = [(events_total,), (dau,)]
        return conn

    def test_upserts_events_total_and_dau(self):
        conn = self._make_conn(events_total=500, dau=120)

        with patch("main.upsert_metric") as mock_upsert:
            recompute_metrics_for_date(conn, "2024-01-01")

        assert mock_upsert.call_count == 2
        calls = mock_upsert.call_args_list
        assert calls[0] == call(conn, "2024-01-01", "EVENTS_TOTAL", 500)
        assert calls[1] == call(conn, "2024-01-01", "DAU", 120)

    def test_zero_events_still_upserts(self):
        conn = self._make_conn(events_total=0, dau=0)

        with patch("main.upsert_metric") as mock_upsert:
            recompute_metrics_for_date(conn, "2024-01-01")

        assert mock_upsert.call_count == 2

    def test_executes_two_queries(self):
        conn = self._make_conn(events_total=10, dau=5)

        with patch("main.upsert_metric"):
            recompute_metrics_for_date(conn, "2024-03-15")

        cursor = conn.cursor.return_value.__enter__.return_value
        assert cursor.execute.call_count == 2
