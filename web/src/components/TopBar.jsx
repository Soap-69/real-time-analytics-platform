// src/components/TopBar.jsx
import React from "react";

export default function TopBar() {
    return (
        <header className="border-b border-rtap-border px-4 md:px-6 h-16 flex items-center justify-between bg-slate-950/80 backdrop-blur">
            <div>
                <h1 className="text-lg font-semibold capitalize">
                    {document.location.pathname.replace("/", "") || "overview"}
                </h1>
                <p className="text-xs text-slate-400">See key metrics for your platform.</p>
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
    );
}
