// src/components/Sidebar.jsx
import React from "react";
import SidebarItem from "./SidebarItem";

export default function Sidebar() {
    return (
        <aside className="hidden md:flex w-60 flex-col border-r border-rtap-border bg-white">
            <div className="px-5 py-5 flex items-center gap-3 border-b border-rtap-border">
                <div className="h-8 w-8 rounded-lg bg-rtap-accent flex items-center justify-center text-white text-sm font-bold">
                    R
                </div>
                <div>
                    <div className="font-semibold text-gray-900 text-sm">RTAP</div>
                    <div className="text-xs text-gray-400">Analytics Platform</div>
                </div>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-0.5 text-sm">
                <SidebarItem label="Overview"  icon="📊" to="/" />
                <SidebarItem label="Events"    icon="📦" to="/events" />
                <SidebarItem label="Users"     icon="👤" to="/users" />
                <SidebarItem label="Settings"  icon="⚙️" to="/settings" />
            </nav>

            <div className="px-4 py-4 border-t border-rtap-border text-xs text-gray-400">
                © {new Date().getFullYear()} RTAP
            </div>
        </aside>
    );
}
