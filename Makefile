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
