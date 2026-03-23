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
            <section className="flex flex-col md:flex-row gap-4 md:items-end">
                {/* Metric selector */}
                <div className="flex-1 max-w-xs">
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                        Metric
                    </label>
                    <select
                        className="w-full rounded-md border border-rtap-border bg-slate-900/80 px-3 py-2 text-sm"
                        value={metric}
                        onChange={(e) => setMetric(e.target.value)}
                    >
                        {METRICS.map((m) => (
                            <option key={m.id} value={m.id}>
                                {m.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* From / To */}
                <div className="flex-1 flex flex-col md:flex-row gap-4">
                    <DateField label="From" value={fromDate} onChange={setFromDate} />
                    <DateField label="To" value={toDate} onChange={setToDate} />
                </div>

                {/* Apply */}
                <div className="md:ml-auto">
                    <button
                        onClick={() => load()}
                        className="inline-flex items-center justify-center rounded-md bg-rtap-accent px-4 py-2 text-sm font-medium hover:bg-indigo-500"
                    >
                        {loading ? "Loading…" : "Apply filters"}
                    </button>
                </div>
            </section>

            {/* Error */}
            {error && (
                <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                    {error}
                </div>
            )}

            {/* Summary Cards */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SummaryCard title="Metric" value={metric} />
                <SummaryCard title="Range" value={`${fromDate} → ${toDate}`} />
                <SummaryCard
                    title="Days Count"
                    value={daysCount}
                    hint={daysCount === 0 ? "No data in selected range" : null}
                />
            </section>

            {/* Chart + Table */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Chart */}
                <div className="lg:col-span-2 rounded-xl border border-rtap-border bg-slate-950/60 p-4">
                    <h2 className="text-sm font-semibold mb-3">
                        {METRICS.find((m) => m.id === metric)?.label}
                    </h2>

                    <div className="h-64">
                        {loading ? (
                            <div className="flex h-full items-center justify-center text-sm text-slate-400">
                                Loading…
                            </div>
                        ) : data.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-1">
                                <div className="text-sm font-medium">No data for selected date range</div>
                                <div className="text-xs text-slate-500">
                                    Try selecting a date range with ingested events
                                </div>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} />
                                    <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} width={60} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#020617",
                                            border: "1px solid #1f2937",
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#6366f1"
                                        strokeWidth={2}
                                        dot={{ r: 3 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-xl border border-rtap-border bg-slate-950/60 p-4">
                    <h2 className="text-sm font-semibold mb-3">Daily values ({metric})</h2>
                    <table className="min-w-full border-collapse text-xs">
                        <thead className="bg-slate-900/80">
                        <tr>
                            <th className="px-3 py-2 border-b border-rtap-border text-left">Date</th>
                            <th className="px-3 py-2 border-b border-rtap-border text-right">Value</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((row) => (
                            <tr key={row.date} className="odd:bg-slate-900/40">
                                <td className="px-3 py-2 border-b border-rtap-border/60">{row.date}</td>
                                <td className="px-3 py-2 border-b border-rtap-border/60 text-right">
                                    {row.value}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

