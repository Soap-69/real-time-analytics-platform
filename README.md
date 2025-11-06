# Real-Time Event Analytics Platform (Starter)
Minimal starter to get the stack running: Postgres, Redis, Spring Boot backend, and a tiny Python pipeline.

## Prereqs
- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Git

## Quickstart
```bash
docker compose up -d --build
```
Then test:
- Backend health: http://localhost:8080/api/v1/health → `{"status":"UP"}`
- Postgres: connect on `localhost:5432` (postgres/postgres)
- Redis: `localhost:6379`
- Pipeline logs: `docker compose logs -f pipeline`
```

## Next Steps
- Add `/api/v1/events` POST endpoint
- Expand pipeline to aggregate daily metrics
- Add Prometheus + Grafana