// src/App.jsx
import React, { useEffect, useState } from "react";
import { fetchDailyMetrics } from "./lib/api";
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

export default function App() {
    // state
    const [metric, setMetric] = useState("DAU");
    const [fromDate, setFromDate] = useState(
        formatDateInput(addDays(new Date(), -6))
    );
    const [toDate, setToDate] = useState(formatDateInput(new Date()));
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // derived
    const daysCount = data.length;

    // initial load
    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function load(e) {
        if (e) e.preventDefault();
        try {
            setLoading(true);
            setError("");
            const metrics = await fetchDailyMetrics(metric, fromDate, toDate);
            setData(metrics);
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to fetch metrics");
            setData([]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex bg-rtap-bg text-slate-100">
            {/* Sidebar */}
            <aside className="hidden md:flex w-64 flex-col border-r border-rtap-border bg-gradient-to-b from-slate-950 to-slate-900">
                <div className="px-6 py-6 flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-rtap-accent/90 flex items-center justify-center text-xl font-bold">
                        R
                    </div>
                    <div>
                        <div className="font-semibold tracking-tight">
                            RTAP Dashboard
                        </div>
                        <div className="text-xs text-slate-400">
                            Real-Time Analytics Platform
                        </div>
                    </div>
                </div>

                <nav className="mt-4 flex-1 space-y-1 px-3 text-sm">
                    <SidebarItem active label="Overview" icon="📊" />
                    <SidebarItem label="Events" icon="📦" />
                    <SidebarItem label="Users" icon="👤" />
                    <SidebarItem label="Settings" icon="⚙️" />
                </nav>

                <div className="px-4 py-4 border-t border-rtap-border text-xs text-slate-500">
                    © {new Date().getFullYear()} RTAP
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col">
                {/* Top bar */}
                <header className="border-b border-rtap-border px-4 md:px-6 h-16 flex items-center justify-between bg-slate-950/80 backdrop-blur">
                    <div>
                        <h1 className="text-lg font-semibold">Overview</h1>
                        <p className="text-xs text-slate-400">
                            See key metrics for your platform.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right text-xs">
                            <div className="font-medium">Yi Sun</div>
                            <div className="text-slate-400">Owner · RTAP</div>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-rtap-accent to-indigo-300 flex items-center justify-center text-xs font-semibold">
                            YS
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-6">
                    {/* Filters row */}
                    <section className="flex flex-col md:flex-row gap-4 md:items-end">
                        {/* Metric selector */}
                        <div className="flex-1 max-w-xs">
                            <label className="block text-xs font-medium text-slate-400 mb-1">
                                Metric
                            </label>
                            <select
                                className="w-full rounded-md border border-rtap-border bg-slate-900/80 px-3 py-2 text-sm outline-none ring-rtap-accent focus:ring-1"
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

                        {/* Date range */}
                        <div className="flex-1 flex flex-col md:flex-row gap-4">
                            <DateField
                                label="From"
                                value={fromDate}
                                onChange={setFromDate}
                            />
                            <DateField
                                label="To"
                                value={toDate}
                                onChange={setToDate}
                            />
                        </div>

                        {/* Apply button */}
                        <div className="md:ml-auto">
                            <button
                                onClick={load}
                                className="inline-flex items-center justify-center rounded-md bg-rtap-accent px-4 py-2 text-sm font-medium shadow-sm hover:bg-indigo-500 transition-colors"
                            >
                                {loading ? "Loading…" : "Apply filters"}
                            </button>
                        </div>
                    </section>

                    {/* Error banner */}
                    {error && (
                        <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                            {error}
                        </div>
                    )}

                    {/* Summary cards */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <SummaryCard
                            title="Metric"
                            value={METRICS.find((m) => m.id === metric)?.id || metric}
                        />
                        <SummaryCard
                            title="Range"
                            value={`${fromDate} → ${toDate}`}
                        />
                        <SummaryCard title="Days Count" value={daysCount} />
                    </section>

                    {/* Chart + table */}
                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                        {/* Line chart */}
                        <div className="lg:col-span-2 rounded-xl border border-rtap-border bg-slate-950/60 p-4 md:p-5">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-sm font-semibold">
                                    {METRICS.find((m) => m.id === metric)?.label ||
                                        metric}
                                </h2>
                                <span className="text-xs text-slate-500">
                  Daily values
                </span>
                            </div>
                            <div className="h-64">
                                {loading ? (
                                    <div className="h-full flex items-center justify-center text-xs text-slate-400">
                                        Loading…
                                    </div>
                                ) : data.length === 0 ? (
                                    <div className="h-full flex items-center justify-center text-xs text-slate-500">
                                        No data for this range.
                                    </div>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={data}>
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                stroke="#1f2937"
                                            />
                                            <XAxis
                                                dataKey="date"
                                                tick={{ fontSize: 11, fill: "#9ca3af" }}
                                            />
                                            <YAxis
                                                tick={{ fontSize: 11, fill: "#9ca3af" }}
                                                width={60}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "#020617",
                                                    border: "1px solid #1f2937",
                                                    fontSize: 12,
                                                }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="value"
                                                stroke="#6366f1"
                                                strokeWidth={2}
                                                dot={{ r: 3 }}
                                                activeDot={{ r: 5 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>

                        {/* Table */}
                        <div className="rounded-xl border border-rtap-border bg-slate-950/60 p-4 md:p-5">
                            <h2 className="text-sm font-semibold mb-3">
                                Daily values ({metric})
                            </h2>
                            <div className="border border-rtap-border rounded-lg overflow-hidden text-xs">
                                <table className="min-w-full border-collapse">
                                    <thead className="bg-slate-900/80">
                                    <tr className="text-left">
                                        <th className="px-3 py-2 border-b border-rtap-border">
                                            Date
                                        </th>
                                        <th className="px-3 py-2 border-b border-rtap-border text-right">
                                            Value
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {loading ? (
                                        <tr>
                                            <td
                                                colSpan={2}
                                                className="px-3 py-4 text-center text-slate-400"
                                            >
                                                Loading…
                                            </td>
                                        </tr>
                                    ) : data.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={2}
                                                className="px-3 py-4 text-center text-slate-500"
                                            >
                                                No data.
                                            </td>
                                        </tr>
                                    ) : (
                                        data.map((row) => (
                                            <tr
                                                key={row.date}
                                                className="odd:bg-slate-900/40"
                                            >
                                                <td className="px-3 py-2 border-b border-rtap-border/60">
                                                    {row.date}
                                                </td>
                                                <td className="px-3 py-2 border-b border-rtap-border/60 text-right">
                                                    {row.value}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}

/* Small UI helpers */

function SidebarItem({ label, icon, active }) {
    return (
        <button
            className={`w-full flex items-center gap-2 rounded-md px-3 py-2 text-left transition-colors ${
                active
                    ? "bg-slate-800 text-slate-50"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
            }`}
            type="button"
        >
            <span className="text-base">{icon}</span>
            <span>{label}</span>
        </button>
    );
}

function SummaryCard({ title, value }) {
    return (
        <div className="rounded-xl border border-rtap-border bg-slate-950/60 px-4 py-3">
            <div className="text-xs text-slate-400 mb-1">{title}</div>
            <div className="text-lg font-semibold">{value}</div>
        </div>
    );
}

function DateField({ label, value, onChange }) {
    return (
        <div className="flex-1">
            <label className="block text-xs font-medium text-slate-400 mb-1">
                {label}
            </label>
            <input
                type="date"
                className="w-full rounded-md border border-rtap-border bg-slate-900/80 px-3 py-2 text-sm outline-none ring-rtap-accent focus:ring-1"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}
