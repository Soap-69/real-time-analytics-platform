.PHONY: up down logs ps psql

    up:
		docker compose up -d --build

    down:
		docker compose down -v

    logs:
		docker compose logs -f --tail=200

    ps:
		docker compose ps

    psql:
		docker compose exec -it postgres psql -U postgres -d analytics
smoke:
	@echo "Starting stack fresh..."
	docker compose down -v
	docker compose up -d --build
	@sleep 4
	@echo "Health:"
	curl -s -i http://localhost:8080/api/v1/health | head -n 1 || true

load:
	@TOKEN=$$(curl -s -X POST http://localhost:8080/api/v1/auth/login \
	  -H "Content-Type: application/json" -d '{"username":"demo","password":"demo123"}' \
	  | sed -E 's/.*"token":"([^"]+)".*/\1/') && \
	docker run --rm -i \
	  -e BASE=http://host.docker.internal:8080 \
	  -e TOKEN="$$TOKEN" \
	  -v "$$PWD/load":/scripts grafana/k6 run /scripts/k6-events.js
