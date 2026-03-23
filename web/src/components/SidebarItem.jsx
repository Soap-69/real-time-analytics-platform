// src/components/SidebarItem.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function SidebarItem({ label, icon, to }) {
    const location = useLocation();
    const active = location.pathname === to;

    return (
        <Link
            to={to}
            className={`w-full flex items-center gap-2 rounded-md px-3 py-2 text-left transition-colors ${
                active
                    ? "bg-slate-800 text-slate-50"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
            }`}
        >
            <span className="text-base">{icon}</span>
            <span>{label}</span>
        </Link>
    );
}
