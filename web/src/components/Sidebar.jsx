// src/components/Sidebar.jsx
import React from "react";
import SidebarItem from "./SidebarItem";

export default function Sidebar() {
    return (
        <aside className="hidden md:flex w-64 flex-col border-r border-rtap-border bg-gradient-to-b from-slate-950 to-slate-900">
            <div className="px-6 py-6 flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-rtap-accent/90 flex items-center justify-center text-xl font-bold">
                    R
                </div>
                <div>
                    <div className="font-semibold tracking-tight">RTAP Dashboard</div>
                    <div className="text-xs text-slate-400">
                        Real-Time Analytics Platform
                    </div>
                </div>
            </div>

            <nav className="mt-4 flex-1 space-y-1 px-3 text-sm">
                <SidebarItem label="Overview" icon="📊" to="/" />
                <SidebarItem label="Events" icon="📦" to="/events" />
                <SidebarItem label="Users" icon="👤" to="/users" />
                <SidebarItem label="Settings" icon="⚙️" to="/settings" />
            </nav>

            <div className="px-4 py-4 border-t border-rtap-border text-xs text-slate-500">
                © {new Date().getFullYear()} RTAP
            </div>
        </aside>
    );
}
