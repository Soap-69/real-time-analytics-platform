# Contributing to Real-Time Analytics Platform (RTAP)

Thank you for your interest in contributing!
Please follow these lightweight guidelines to keep the codebase clean.

## Requirements

- Java 21
- Node 20
- Python 3.11+
- Docker & Docker Compose (required for backend integration tests)

## Testing

Run all tests before submitting a PR:

```bash
# Backend — unit + integration tests (requires Docker for Testcontainers)
cd backend && mvn verify

# Frontend
cd web && npm test

# Python pipeline
cd pipeline && python -m pytest tests/ -v
```

CI runs all three automatically on every push and pull request.

## Development workflow

1. Fork the repo and create a feature branch
2. Use **Conventional Commits**:
   - `feat:` new feature
   - `fix:` bug fix
   - `chore:` cleanup, docs, refactor
3. Submit a Pull Request:
   - Ensure CI passes
   - Provide a clear description of what changed and why

## Code style

- Java: follow Spring Boot conventions, constructor injection over field injection
- Python: use `black` formatting
- TypeScript/JSX: ESLint enforced via `npm run lint`
- YAML: 2-space indentation

Happy hacking!
