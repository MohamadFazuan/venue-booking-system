# VenueKL — Venue Booking System

A full-featured, responsive venue booking web application for Malaysian event spaces. Built with React + Vite + Tailwind CSS.

## Features

- **Public** — Browse venues, view details, multi-step booking flow, booking tracker
- **Admin** — Dashboard, booking management (approve/reject), venue CRUD, calendar view
- **6 realistic Malaysian venues** with MYR pricing, amenities, and mock reviews
- Fully responsive (mobile / tablet / desktop)

## Quick Start

### Local development

```bash
npm install
npm run dev          # http://localhost:3000
```

### With Docker (production)

```bash
docker compose up -d          # http://localhost:8080
```

### With Docker (dev, hot-reload)

```bash
docker compose -f docker-compose.dev.yml up
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run test` | Run unit tests |
| `npm run test:coverage` | Tests + coverage report |
| `npm run lint` | ESLint check |
| `npm run format` | Prettier format |
| `./scripts/build.sh` | Build Docker image |
| `./scripts/deploy.sh` | Deploy via docker-compose |
| `./scripts/health-check.sh` | Verify container health |

## Project Structure

```
├── VenueBookingApp.jsx     # Main React app (single-file, phase-by-phase build)
├── src/
│   ├── main.jsx            # Vite entry point
│   ├── index.css           # Tailwind base styles
│   └── utils/
│       └── helpers.js      # Pure utility functions (testable)
├── tests/
│   ├── setup.js            # Vitest + Testing Library setup
│   └── unit/
│       ├── helpers.test.js # Utility function unit tests
│       └── App.test.jsx    # Integration / smoke tests
├── docker/
│   └── nginx.conf          # Production nginx (security headers, CSP, gzip)
├── scripts/
│   ├── build.sh            # Docker image build
│   ├── deploy.sh           # docker-compose deploy with health check rollback
│   └── health-check.sh     # Container health verification
├── .github/workflows/
│   ├── ci.yml              # Lint → Test → Build → Docker smoke test
│   └── deploy.yml          # Tag-triggered push to GHCR + SSH deploy
├── Dockerfile              # Multi-stage production image (nginx:alpine, non-root)
├── Dockerfile.dev          # Development image with hot-reload
├── docker-compose.yml      # Production stack
├── docker-compose.dev.yml  # Dev stack
└── SECURITY.md             # Security controls and vulnerability reporting
```

## Admin Access

| Field | Value |
|-------|-------|
| URL | `/` → click **Admin** in navbar |
| Email | `admin@venue.com` |
| Password | `admin123` |

> Hardcoded credentials for demo only. Replace with real auth before production.

## Tech Stack

- **React 18** — UI framework
- **Vite 5** — Build tool
- **Tailwind CSS 3** — Utility-first styling
- **lucide-react** — Icon library
- **Vitest + Testing Library** — Unit & integration tests
- **nginx:alpine** — Production static server
- **Docker** — Containerised deployment
- **GitHub Actions** — CI/CD pipeline