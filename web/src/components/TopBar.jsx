// src/components/TopBar.jsx
import React from "react";

export default function TopBar() {
    const page = document.location.pathname.replace("/", "") || "overview";

    return (
        <header className="border-b border-rtap-border px-6 h-16 flex items-center justify-between bg-white">
            <div>
                <h1 className="text-base font-semibold text-gray-900 capitalize">{page}</h1>
                <p className="text-xs text-gray-400">Real-Time Analytics Platform</p>
            </div>

            <div className="flex items-center gap-3">
                <div className="text-right text-xs hidden sm:block">
                    <div className="font-medium text-gray-700">Esun</div>
                    <div className="text-gray-400">Owner · RTAP</div>
                </div>
                <div className="h-8 w-8 rounded-full bg-rtap-accent flex items-center justify-center text-white text-xs font-semibold">
                    ES
                </div>
            </div>
        </header>
    );
}
