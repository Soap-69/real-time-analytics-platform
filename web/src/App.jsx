import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";
const TOKEN = import.meta.env.VITE_API_TOKEN || "";

// Helper: format Date → yyyy-mm-dd
function formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

// Default range: last 7 days (including today)
const today = new Date();
const defaultTo = formatDate(today);
const defaultFrom = formatDate(new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000));

export default function App() {
    const [metricName, setMetricName] = useState("DAU");
    const [fromDate, setFromDate] = useState(defaultFrom);
    const [toDate, setToDate] = useState(defaultTo);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [points, setPoints] = useState([]);

    // Derived info for the summary cards
    const daysCount = points.length;

    async function loadMetrics(selectedMetric, from, to) {
        setLoading(true);
        setError("");

        try {
            const params = new URLSearchParams({
                name: selectedMetric,
                from,
                to,
            });

            const res = await fetch(
                `${API_BASE}/api/v1/metrics/daily?${params.toString()}`,
                {
                    headers: {
                        Authorization: TOKEN ? `Bearer ${TOKEN}` : "",
                    },
                }
            );

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Metrics fetch failed: ${res.status} ${text}`);
            }

            const data = await res.json();
            // Backend returns: { name, from, to, points:[ {date,value}, ...] }
            setPoints(data.points || []);
        } catch (e) {
            console.error(e);
            setError(e.message || "Unknown error");
            setPoints([]);
        } finally {
            setLoading(false);
        }
    }

    // Initial load on page open
    useEffect(() => {
        loadMetrics(metricName, fromDate, toDate);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function handleSubmit(e) {
        e.preventDefault();
        loadMetrics(metricName, fromDate, toDate);
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "grid",
                gridTemplateColumns: "280px 1fr",
                background: "#050712",
                color: "#f9fafb",
                fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
            }}
        >
            {/* Sidebar */}
            <aside
                style={{
                    borderRight: "1px solid #111827",
                    padding: "1.5rem 1.5rem 2rem",
                    background: "#050712",
                }}
            >
                <h1 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                    RTAP Dashboard
                </h1>
                <p style={{ fontSize: "0.9rem", color: "#9ca3af", marginBottom: "2rem" }}>
                    Real-Time Analytics Platform · Frontend
                </p>

                <div
                    style={{
                        display: "grid",
                        gap: "1rem",
                    }}
                >
                    {/* Metric card */}
                    <div
                        style={{
                            background: "#0b1020",
                            borderRadius: "0.75rem",
                            padding: "1rem 1.2rem",
                            boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
                        }}
                    >
                        <div style={{ fontSize: "0.8rem", color: "#9ca3af", marginBottom: "0.4rem" }}>
                            Metric
                        </div>
                        <div style={{ fontSize: "1.2rem", fontWeight: 600 }}>{metricName}</div>
                    </div>

                    {/* Range card */}
                    <div
                        style={{
                            background: "#0b1020",
                            borderRadius: "0.75rem",
                            padding: "1rem 1.2rem",
                            boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
                        }}
                    >
                        <div style={{ fontSize: "0.8rem", color: "#9ca3af", marginBottom: "0.4rem" }}>
                            Range
                        </div>
                        <div style={{ fontSize: "1rem", fontWeight: 500 }}>
                            {fromDate} → {toDate}
                        </div>
                    </div>

                    {/* Days count */}
                    <div
                        style={{
                            background: "#0b1020",
                            borderRadius: "0.75rem",
                            padding: "1rem 1.2rem",
                            boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
                        }}
                    >
                        <div style={{ fontSize: "0.8rem", color: "#9ca3af", marginBottom: "0.4rem" }}>
                            Days Count
                        </div>
                        <div style={{ fontSize: "1.2rem", fontWeight: 600 }}>{daysCount}</div>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <main style={{ padding: "1.5rem 2rem" }}>
                {/* Filters */}
                <form
                    onSubmit={handleSubmit}
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "1rem",
                        alignItems: "flex-end",
                        marginBottom: "1.5rem",
                    }}
                >
                    {/* Metric select */}
                    <div style={{ minWidth: "150px" }}>
                        <label
                            style={{
                                display: "block",
                                fontSize: "0.8rem",
                                color: "#9ca3af",
                                marginBottom: "0.25rem",
                            }}
                        >
                            Metric
                        </label>
                        <select
                            value={metricName}
                            onChange={(e) => setMetricName(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "0.5rem 0.75rem",
                                borderRadius: "0.5rem",
                                border: "1px solid #1f2937",
                                background: "#020617",
                                color: "#f9fafb",
                            }}
                        >
                            <option value="DAU">DAU (Daily Active Users)</option>
                            <option value="EVENTS_TOTAL">EVENTS_TOTAL (All events)</option>
                        </select>
                    </div>

                    {/* From date */}
                    <div>
                        <label
                            style={{
                                display: "block",
                                fontSize: "0.8rem",
                                color: "#9ca3af",
                                marginBottom: "0.25rem",
                            }}
                        >
                            From
                        </label>
                        <input
                            type="date"
                            value={fromDate}
                            max={toDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            style={{
                                padding: "0.5rem 0.75rem",
                                borderRadius: "0.5rem",
                                border: "1px solid #1f2937",
                                background: "#020617",
                                color: "#f9fafb",
                            }}
                        />
                    </div>

                    {/* To date */}
                    <div>
                        <label
                            style={{
                                display: "block",
                                fontSize: "0.8rem",
                                color: "#9ca3af",
                                marginBottom: "0.25rem",
                            }}
                        >
                            To
                        </label>
                        <input
                            type="date"
                            value={toDate}
                            min={fromDate}
                            max={defaultTo}
                            onChange={(e) => setToDate(e.target.value)}
                            style={{
                                padding: "0.5rem 0.75rem",
                                borderRadius: "0.5rem",
                                border: "1px solid #1f2937",
                                background: "#020617",
                                color: "#f9fafb",
                            }}
                        />
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: "0.6rem 1rem",
                            borderRadius: "0.5rem",
                            border: "none",
                            background: loading ? "#4b5563" : "#6366f1",
                            color: "white",
                            fontWeight: 600,
                            cursor: loading ? "default" : "pointer",
                        }}
                    >
                        {loading ? "Loading…" : "Apply filters"}
                    </button>
                </form>

                {/* Error message */}
                {error && (
                    <div
                        style={{
                            marginBottom: "1rem",
                            padding: "0.75rem 1rem",
                            borderRadius: "0.5rem",
                            background: "#7f1d1d",
                            color: "#fee2e2",
                            fontSize: "0.9rem",
                        }}
                    >
                        Error: {error}
                    </div>
                )}

                {/* Table */}
                <section>
                    <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.75rem" }}>
                        Daily values ({metricName})
                    </h2>

                    <div
                        style={{
                            borderRadius: "0.75rem",
                            overflow: "hidden",
                            border: "1px solid #111827",
                            background: "#020617",
                        }}
                    >
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                            <thead style={{ background: "#020617" }}>
                            <tr>
                                <th
                                    style={{
                                        textAlign: "left",
                                        padding: "0.6rem 0.9rem",
                                        borderBottom: "1px solid #111827",
                                        color: "#9ca3af",
                                        fontWeight: 500,
                                    }}
                                >
                                    Date
                                </th>
                                <th
                                    style={{
                                        textAlign: "left",
                                        padding: "0.6rem 0.9rem",
                                        borderBottom: "1px solid #111827",
                                        color: "#9ca3af",
                                        fontWeight: 500,
                                    }}
                                >
                                    Value
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {points.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={2}
                                        style={{
                                            padding: "0.75rem 0.9rem",
                                            color: "#6b7280",
                                            fontStyle: "italic",
                                        }}
                                    >
                                        No data for this range.
                                    </td>
                                </tr>
                            ) : (
                                points.map((p) => (
                                    <tr key={p.date}>
                                        <td
                                            style={{
                                                padding: "0.55rem 0.9rem",
                                                borderBottom: "1px solid #111827",
                                            }}
                                        >
                                            {p.date}
                                        </td>
                                        <td
                                            style={{
                                                padding: "0.55rem 0.9rem",
                                                borderBottom: "1px solid #111827",
                                            }}
                                        >
                                            {p.value}
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
}
