// src/pages/Settings.jsx
import React, { useState } from "react";

export default function SettingsPage() {
    const [darkMode, setDarkMode] = useState(true);
    const [apiBase, setApiBase] = useState(import.meta.env.VITE_API_BASE);

    return (
        <div className="space-y-6 max-w-lg">
            <div className="rounded-xl border border-rtap-border bg-white shadow-card p-6 space-y-5">

                {/* Dark mode toggle */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-sm font-medium text-gray-700">Theme</div>
                        <div className="text-xs text-gray-400">Toggle light / dark mode</div>
                    </div>
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                            darkMode
                                ? "bg-rtap-accent text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        {darkMode ? "Dark" : "Light"}
                    </button>
                </div>

                <div className="border-t border-rtap-border" />

                {/* API base URL */}
                <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-gray-500">API Base URL</label>
                    <input
                        className="w-full rounded-lg border border-rtap-border bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-rtap-accent/30 focus:border-rtap-accent"
                        value={apiBase}
                        onChange={(e) => setApiBase(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}
