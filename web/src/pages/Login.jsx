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
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-900 p-6 space-y-4"
            >
                <h1 className="text-lg font-semibold">RTAP Login</h1>

                {error && (
                    <div className="text-xs text-red-400">{error}</div>
                )}

                <input
                    className="w-full rounded-md bg-slate-800 px-3 py-2 text-sm"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="password"
                    className="w-full rounded-md bg-slate-800 px-3 py-2 text-sm"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    className="w-full rounded-md bg-indigo-600 py-2 text-sm font-medium"
                    disabled={loading}
                >
                    {loading ? "Signing in…" : "Sign in"}
                </button>
            </form>
        </div>
    );
}
