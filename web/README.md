# RTAP Web

React 19 dashboard for the Real-Time Analytics Platform. Built with Vite, Tailwind CSS, and Recharts.

## Stack

- **React 19** with React Router 7
- **Vite 7** — dev server and build
- **Tailwind CSS 3** — styling
- **Recharts** — line charts
- **TypeScript** — `api.ts`, `auth.ts`
- **Vitest + React Testing Library** — unit tests

## Development

```bash
npm install
npm run dev        # Vite dev server on http://localhost:5173
```

The dev server proxies `/api/*` to `http://localhost:8080` (Spring Boot). Make sure the backend is running first.

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | ESLint |
| `npm test` | Run Vitest tests once |
| `npm run test:watch` | Run Vitest in watch mode |

## Environment

| Variable | Description |
|---|---|
| `VITE_API_BASE` | Backend base URL (only needed for non-proxied builds) |

In Docker, the Nginx config proxies `/api/` to the backend — no build-time env var needed.
