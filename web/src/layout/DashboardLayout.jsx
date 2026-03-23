import { Outlet, useNavigate } from "react-router-dom";
import { logout } from "../lib/auth";

export default function DashboardLayout() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex bg-rtap-bg text-slate-100">
            {/* Sidebar */}
            <aside className="w-64 border-r border-rtap-border bg-slate-950">
                <div className="px-6 py-6 font-semibold">RTAP Dashboard</div>

                <nav className="px-3 space-y-1 text-sm">
                    <NavItem label="Overview" onClick={() => navigate("/")} />
                    <NavItem label="Users" onClick={() => navigate("/users")} />
                    <NavItem label="Settings" onClick={() => navigate("/settings")} />
                </nav>
            </aside>

            {/* Content */}
            <div className="flex-1 flex flex-col">
                <header className="h-16 border-b border-rtap-border px-6 flex items-center justify-between">
                    <div className="font-medium">Overview</div>
                    <button
                        onClick={() => {
                            logout();
                            window.location.href = "/login";
                        }}
                        className="text-xs text-slate-400 hover:text-slate-200"
                    >
                        Logout
                    </button>
                </header>

                <Outlet />
            </div>
        </div>
    );
}

function NavItem({ label, onClick }) {
    return (
        <button
            onClick={onClick}
            className="w-full rounded-md px-3 py-2 text-left text-slate-400 hover:bg-slate-800 hover:text-slate-100"
        >
            {label}
        </button>
    );
}
