// src/lib/api.ts

// IMPORTANT:
// Use relative API path so Nginx can proxy to backend
const API_BASE = "/api";

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

/* -------------------------
   Metrics
-------------------------- */
export async function fetchDailyMetrics(
    name: string,
    from: string,
    to: string
): Promise<DailyMetric[]> {
    const url = `${API_BASE}/v1/metrics/daily?name=${encodeURIComponent(
        name
    )}&from=${from}&to=${to}`;

    const res = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
    });

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
            date: row.metricDate ?? row.date ?? "",
            value: row.metricValue ?? row.value ?? 0,
        }));
    }

    // CASE 2: backend returns object with "points"
    if (json.points && Array.isArray(json.points)) {
        return json.points.map((row: MetricRow) => ({
            date: row.metricDate ?? row.date ?? "",
            value: row.metricValue ?? row.value ?? 0,
        }));
    }

    return [];
}

/* -------------------------
   Auth
-------------------------- */
export async function login(
    username: string,
    password: string
): Promise<{ token: string }> {
    const res = await fetch(`${API_BASE}/v1/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Login failed: ${text}`);
    }

    return res.json();
}
