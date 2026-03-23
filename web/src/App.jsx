import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import LoginPage from "./pages/Login";
import OverviewPage from "./pages/Overview";
import UsersPage from "./pages/Users";
import { isAuthenticated } from "./lib/auth";

function ProtectedRoute({ children }) {
    return isAuthenticated() ? children : <Navigate to="/login" />;
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<OverviewPage />} />
                    <Route path="users" element={<UsersPage />} />
                    <Route path="settings" element={<div className="p-6">Settings</div>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
