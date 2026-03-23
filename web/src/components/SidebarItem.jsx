// src/components/SidebarItem.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function SidebarItem({ label, icon, to }) {
    const location = useLocation();
    const active = location.pathname === to;

    return (
        <Link
            to={to}
            className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-left transition-colors ${
                active
                    ? "bg-indigo-50 text-rtap-accent font-medium"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
        >
            <span className="text-base">{icon}</span>
            <span>{label}</span>
        </Link>
    );
}
