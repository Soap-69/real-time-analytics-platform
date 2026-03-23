import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";

export default function DashboardLayout() {
    return (
        <div className="min-h-screen flex bg-rtap-bg text-gray-900">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0">
                <TopBar />

                <main className="flex-1 px-6 py-6 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
