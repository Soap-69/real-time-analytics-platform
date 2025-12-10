// src/lib/api.ts

// Base URL (from env or fallback)
const API_BASE: string =
    import.meta.env.VITE_API_BASE || "http://localhost:8080";

export interface MetricRow {
    metricDate?: string;
    metricValue?: number;
    date?: string;
    value?: number;
}

/** Type definitions */
export interface DailyMetricRow {
    metricDate: string;
    metricValue: number;
}

export interface DailyMetric {
    date: string;
    value: number;
}

/**
 * Fetch daily metrics from backend.
 * Backend endpoint: GET /api/v1/metrics/daily?name=...&from=YYYY-MM-DD&to=YYYY-MM-DD
 */
export async function fetchDailyMetrics(name: string, from: string, to: string) {
    const url = `${API_BASE}/api/v1/metrics/daily?name=${encodeURIComponent(
        name
    )}&from=${from}&to=${to}`;

    const res = await fetch(url);

    if (!res.ok) {
        const text = await res.text();
        throw new Error(
            `Metrics fetch failed: ${res.status} ${res.statusText} – ${text}`
        );
    }

    const json = await res.json();

    // CASE 1: backend returns array directly
    if (Array.isArray(json)) {
        return json.map((row: MetricRow) => ({
            date: row.metricDate ?? row.date,
            value: row.metricValue ?? row.value,
        }));
    }

    // CASE 2: backend returns object with "points"
    if (json.points && Array.isArray(json.points)) {
        return json.points.map((row: MetricRow) => ({
            date: row.metricDate ?? row.date,
            value: row.metricValue ?? row.value,
        }));
    }

    return [];
}
