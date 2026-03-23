// src/pages/Overview.jsx
import React, { useCallback, useEffect, useState } from "react";
import { fetchDailyMetrics } from "../lib/api";
import SummaryCard from "../components/SummaryCard";
import DateField from "../components/DateField";
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const METRICS = [
    { id: "DAU", label: "DAU (Daily Active Users)" },
    { id: "EVENTS_TOTAL", label: "Events Total" },
];

function formatDateInput(date) {
    return date.toISOString().slice(0, 10);
}

function addDays(date, n) {
    const d = new Date(date);
    d.setDate(d.getDate() + n);
    return d;
}

export default function OverviewPage() {
    const [metric, setMetric] = useState("DAU");
    const [fromDate, setFromDate] = useState(formatDateInput(addDays(new Date(), -6)));
    const [toDate, setToDate] = useState(formatDateInput(new Date()));
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const daysCount = data.length;

    const load = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const metrics = await fetchDailyMetrics(metric, fromDate, toDate);
            setData(metrics);
        } catch (err) {
            setError(err.message || "Failed to fetch metrics");
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [metric, fromDate, toDate]);

    useEffect(() => {
        load();
    }, [load]);

    return (
        <div className="space-y-6">
            {/* Filters */}
            <section className="bg-white rounded-xl border border-rtap-border shadow-card p-4 flex flex-col md:flex-row gap-4 md:items-end">
                <div className="flex-1 max-w-xs">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Metric</label>
                    <select
                        className="w-full rounded-lg border border-rtap-border bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-rtap-accent/30 focus:border-rtap-accent"
                        value={metric}
                        onChange={(e) => setMetric(e.target.value)}
                    >
                        {METRICS.map((m) => (
                            <option key={m.id} value={m.id}>{m.label}</option>
                        ))}
                    </select>
                </div>

                <div className="flex-1 flex flex-col md:flex-row gap-4">
                    <DateField label="From" value={fromDate} onChange={setFromDate} />
                    <DateField label="To"   value={toDate}   onChange={setToDate} />
                </div>

                <div className="md:ml-auto">
                    <button
                        onClick={() => load()}
                        disabled={loading}
                        className="inline-flex items-center justify-center rounded-lg bg-rtap-accent px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors"
                    >
                        {loading ? "Loading…" : "Apply filters"}
                    </button>
                </div>
            </section>

            {/* Error */}
            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* Summary Cards */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SummaryCard title="Metric"     value={metric} />
                <SummaryCard title="Date range" value={`${fromDate} → ${toDate}`} />
                <SummaryCard
                    title="Data points"
                    value={daysCount}
                    hint={daysCount === 0 ? "No data in selected range" : null}
                />
            </section>

            {/* Chart + Table */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Chart */}
                <div className="lg:col-span-2 rounded-xl border border-rtap-border bg-white shadow-card p-5">
                    <h2 className="text-sm font-semibold text-gray-700 mb-4">
                        {METRICS.find((m) => m.id === metric)?.label}
                    </h2>

                    <div className="h-64">
                        {loading ? (
                            <div className="flex h-full items-center justify-center text-sm text-gray-400">
                                Loading…
                            </div>
                        ) : data.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-1">
                                <div className="text-sm font-medium text-gray-500">No data for selected date range</div>
                                <div className="text-xs text-gray-400">Try selecting a range with ingested events</div>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} width={50} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#ffffff",
                                            border: "1px solid #e2e8f0",
                                            borderRadius: "8px",
                                            fontSize: "12px",
                                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / .07)",
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#4f46e5"
                                        strokeWidth={2}
                                        dot={{ r: 3, fill: "#4f46e5" }}
                                        activeDot={{ r: 5 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-xl border border-rtap-border bg-white shadow-card p-5">
                    <h2 className="text-sm font-semibold text-gray-700 mb-4">Daily values — {metric}</h2>
                    <table className="min-w-full border-collapse text-xs">
                        <thead>
                        <tr className="border-b border-rtap-border">
                            <th className="pb-2 text-left font-medium text-gray-400 uppercase tracking-wide">Date</th>
                            <th className="pb-2 text-right font-medium text-gray-400 uppercase tracking-wide">Value</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-rtap-border">
                        {data.map((row) => (
                            <tr key={row.date} className="hover:bg-gray-50 transition-colors">
                                <td className="py-2 text-gray-600">{row.date}</td>
                                <td className="py-2 text-right font-medium text-gray-900">{row.value}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

