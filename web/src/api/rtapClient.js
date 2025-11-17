const API_BASE = '/api/v1'  // goes through Vite proxy to backend

// hardcoded demo login for now
export async function loginDemo() {
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: 'demo',
            password: 'demo123',
        }),
    })

    if (!res.ok) {
        const text = await res.text()
        throw new Error(`Login failed: ${res.status} ${text}`)
    }

    const data = await res.json()
    // adjust if your backend uses a different field name
    return data.token
}

export async function fetchDailyMetrics({ name, from, to }, token) {
    const params = new URLSearchParams({ name, from, to })

    const res = await fetch(`${API_BASE}/metrics/daily?` + params.toString(), {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    if (!res.ok) {
        const text = await res.text()
        throw new Error(`Metrics fetch failed: ${res.status} ${text}`)
    }

    return res.json()
}
