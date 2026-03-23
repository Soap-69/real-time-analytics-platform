import { useState } from "react";
import { login } from "../lib/api";
import { saveToken } from "../lib/auth";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setLoading(true);
            setError("");

            const data = await login(username, password);
            saveToken(data.token);

            window.location.href = "/";
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-rtap-bg px-4">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className="h-9 w-9 rounded-xl bg-rtap-accent flex items-center justify-center text-white font-bold text-lg">
                        R
                    </div>
                    <span className="text-xl font-bold text-gray-900">RTAP</span>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-2xl border border-rtap-border shadow-card p-8 space-y-5"
                >
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Sign in</h1>
                        <p className="text-sm text-gray-400 mt-1">Welcome back to your analytics dashboard</p>
                    </div>

                    {error && (
                        <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="block text-xs font-medium text-gray-500">Username</label>
                        <input
                            className="w-full rounded-lg border border-rtap-border bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rtap-accent/30 focus:border-rtap-accent transition"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-medium text-gray-500">Password</label>
                        <input
                            type="password"
                            className="w-full rounded-lg border border-rtap-border bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rtap-accent/30 focus:border-rtap-accent transition"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        className="w-full rounded-lg bg-rtap-accent py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors"
                        disabled={loading}
                    >
                        {loading ? "Signing in…" : "Sign in"}
                    </button>
                </form>
            </div>
        </div>
    );
}
