// src/pages/Settings.jsx
import React, { useState } from "react";

export default function SettingsPage() {
    const [darkMode, setDarkMode] = useState(true);
    const [apiBase, setApiBase] = useState(import.meta.env.VITE_API_BASE);

    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold">Settings</h2>

            <div className="rounded-xl border border-rtap-border bg-slate-950/60 p-4 space-y-4">

                {/* Dark mode toggle */}
                <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Dark Mode</span>
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className={`px-4 py-1 rounded-full text-xs ${
                            darkMode ? "bg-rtap-accent" : "bg-slate-700"
                        }`}
                    >
                        {darkMode ? "Enabled" : "Disabled"}
                    </button>
                </div>

                {/* API base URL */}
                <div className="space-y-1">
                    <label className="text-xs text-slate-400">API Base URL</label>
                    <input
                        className="w-full rounded-md border border-rtap-border bg-slate-900/80 px-3 py-2 text-sm"
                        value={apiBase}
                        onChange={(e) => setApiBase(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}
