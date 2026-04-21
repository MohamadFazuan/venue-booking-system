# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # dev server at http://localhost:3000
npm run build        # production build → dist/
npm run preview      # preview build at http://localhost:8080
npm run lint         # ESLint (0 warnings allowed)
npm run lint:fix     # auto-fix lint
npm run format       # Prettier write
npm run test         # run all tests once
npm run test:watch   # vitest watch mode
npm run test:coverage  # coverage report (thresholds: 70% lines/functions/statements, 60% branches)
```

Run a single test file:
```bash
npx vitest run tests/unit/helpers.test.js
```

Docker:
```bash
docker compose up -d                        # production (nginx, port 8080)
docker compose -f docker-compose.dev.yml up # dev with hot-reload
```

## Architecture

**Single-file app pattern.** All React components, state, mock data, and routing live in `VenueBookingApp.jsx`. `src/main.jsx` is only the Vite entry point that mounts `<App />`.

**State management.** `useReducer` + React Context (`AppContext`). One global store. `appReducer` handles all mutations. Access via `useApp()` hook. No external state library.

**Routing.** String-based SPA router — no React Router. `state.view` drives which component renders. `state.viewData` passes params (e.g. `{ venueId: "v1" }`). Navigate via `navigate(view, data)` from `useApp()`.

**Two user roles:**
- Public: home, venues browse, venue detail, booking flow, my-bookings
- Admin: dashboard, bookings table, calendar, venue CRUD — all behind `state.isAdmin` guard. Login: `admin@venue.com` / `admin123`

**Phase build pattern.** Features are built phase-by-phase. Unbuilt features render `<ComingSoonShell>`. Current stubs:
- `BookingPage` — multi-step booking flow
- `MyBookingsPage` — booking tracker for clients
- `AdminCalendarPage` — monthly calendar view

**Pure utilities** in `src/utils/helpers.js` — `formatMYR`, `generateBookingId`, `getStatusConfig`, `validateEmail`, `validatePhone`, `getBookedDates`, `estimateCost`. These are side-effect free and unit-tested separately from the app.

**Test location:** `tests/unit/` — `helpers.test.js` for utilities, `App.test.jsx` for integration/smoke tests. Vitest + Testing Library. Config is in `vite.config.js` under `test:`.

**Path aliases:** `@` → `./src`, `@utils` → `./src/utils`.

**Mock data** (`VENUES`, `INITIAL_BOOKINGS`, `MOCK_REVIEWS`) is defined at the top of `VenueBookingApp.jsx` and loaded into the initial reducer state. No backend — all state is in-memory.
