import { useEffect, useState } from 'react'
import { loginDemo, fetchDailyMetrics } from './api/rtapClient'
import './App.css'

function formatDate(date) {
    return date.toISOString().slice(0, 10) // YYYY-MM-DD
}

function sevenDaysAgo() {
    const d = new Date()
    d.setDate(d.getDate() - 6)
    return d
}

function App() {
    const [token, setToken] = useState(null)
    const [metrics, setMetrics] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function load() {
            try {
                setLoading(true)
                setError(null)

                // 1) login
                const t = await loginDemo()
                setToken(t)

                // 2) figure out date range: last 7 days
                const to = new Date()
                const from = sevenDaysAgo()

                const metricsResp = await fetchDailyMetrics(
                    {
                        name: 'DAU',
                        from: formatDate(from),
                        to: formatDate(to),
                    },
                    t,
                )

                setMetrics(metricsResp)
            } catch (e) {
                console.error(e)
                setError(e.message)
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [])

    return (
        <div className="app">
            <header className="app-header">
                <h1>RTAP Dashboard</h1>
                <p>Real-Time Analytics Platform · Frontend</p>
            </header>

            <main className="app-main">
                {loading && <p>Loading metrics…</p>}
                {error && <p className="error">Error: {error}</p>}

                {!loading && !error && metrics && (
                    <>
                        <section className="summary">
                            <div className="card">
                                <h2>Metric</h2>
                                <p>{metrics.name}</p>
                            </div>
                            <div className="card">
                                <h2>Range</h2>
                                <p>
                                    {metrics.from} → {metrics.to}
                                </p>
                            </div>
                            <div className="card">
                                <h2>Days Count</h2>
                                <p>{metrics.points?.length ?? 0}</p>
                            </div>
                        </section>

                        <section className="table-section">
                            <h2>Daily Active Users (DAU)</h2>
                            <table>
                                <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Value</th>
                                </tr>
                                </thead>
                                <tbody>
                                {metrics.points?.map((p) => (
                                    <tr key={p.date}>
                                        <td>{p.date}</td>
                                        <td>{p.value}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </section>
                    </>
                )}
            </main>
        </div>
    )
}

export default App
