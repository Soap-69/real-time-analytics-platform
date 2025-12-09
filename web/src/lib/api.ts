// Read base URL from Vite env vars
// This MUST match web/.env → VITE_API_BASE=http://localhost:8080
export const API_BASE =
    import.meta.env.VITE_API_BASE?.trim() || '/api';

// ---- Fetch Daily Metrics ----

export async function fetchDailyMetrics(
    name: string,
    from: string,
    to: string
) {
    const url = `${API_BASE}/api/v1/metrics/daily?name=${encodeURIComponent(
        name
    )}&from=${from}&to=${to}`;

    console.log("Requesting:", url);

    const token = localStorage.getItem("rtap_token") ?? "";

    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(
            `Metrics fetch failed: ${res.status} — ${errorBody}`
        );
    }

    return res.json();
}

// ---- Fetch Current JWT Token (login demo user) ----

export async function loginDemoUser() {
    const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: "demo",
            password: "demo123"
        }),
    });

    if (!res.ok) {
        throw new Error("Failed to login demo user");
    }

    return res.json();
}
