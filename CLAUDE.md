# CLAUDE.md — EchoOfTime Project Guide

This file gives Claude essential context for working on this codebase. Read `design.md` for full architecture details.

---

## What this project is

EchoOfTime is a React + Firebase single-page app for hierarchical task planning and time tracking. Plans follow a **Marathon (long-term goal) → Sprint (short-term plan) → Daily Task** hierarchy. Users can track time per task, focus with a timer, and review progress through dashboards.

---

## Tech stack (quick reference)

- **React 18** with functional components and hooks throughout
- **Redux Toolkit** for global state (`activePlan`, `backlogPlan`, `focusTimer` slices)
- **Context API** (`auth-context.js`) for authentication / Firebase token management
- **Firebase Realtime Database** as backend; direct REST API calls (no Firebase SDK)
- **React Router DOM 6** for routing
- **Bootstrap 5 + CSS Modules** for styling
- **FontAwesome** for icons

---

## Key file locations

| What | Where |
|---|---|
| Redux store setup | `src/store/slices/index.js` |
| Active plan state + reducers | `src/store/slices/active-plan-slice.js` |
| Active plan async thunks | `src/store/slices/active-plan-actions.js` |
| Backlog state + thunks | `src/store/slices/backlog-plan-slice.js`, `backlog-plan-actions.js` |
| Focus timer slice | `src/store/slices/focus-timer-slice.js` |
| Auth context | `src/store/auth-context.js` |
| Date utilities | `src/utilities.js` |
| Main routing | `src/App.js` |
| Today dashboard | `src/components/Dashboards/Today/TodayPlans.js` |
| Individual today task (timer logic) | `src/components/Dashboards/Today/TodayPlan.js` |
| Sprint dashboard | `src/components/Dashboards/Sprint/Sprint.js` |
| Backlog dashboard | `src/components/Dashboards/Backlog/Backlog.js` |
| Daily task in plans view | `src/components/Plans/DailyPlans/DailyPlan.js` |
| Long-term plan component | `src/components/Plans/LongTermPlans/LongTermPlan.js` |

---

## Data model essentials

A **DailyPlan** (task) has: `id` (UUID), `title`, `comment`, `date` (YYYY-MM-DD), `seconds` (time spent), `expected_hours`, `expected_minutes`, `priority` (0 = highest), `parent_id` (subtasks), `has_children`, `show_plan`, `completed`, `rank`.

Firebase path per user: `/{userID}/active_plan/`, `/{userID}/backlog/`, `/{userID}/archived_plans/`.

Dates before 2:00 AM belong to the previous calendar day (overnight shift support).

---

## Coding conventions

- Functional components only, hooks-based
- `useRef` for form inputs (avoids re-renders; read via `ref.current.value`)
- Section comments style: `/* ========== Category ========== */`
- CSS: one `.module.css` per component, kebab-case class names
- Async Redux operations are thunks in separate `*-actions.js` files
- `useLatest` pattern in `TodayPlan.js` to capture latest state in timer cleanup functions
- Error handling: try/catch in async thunks; 401 → automatic token refresh → retry; other errors → `alert()`

---

## What NOT to do

- Do not add a Firebase SDK — the app uses direct REST calls intentionally
- Do not add `.env` for Firebase config — the Firebase API key is already public in source (it's a client-side key secured by Firebase rules)
- Do not break the `useLatest` pattern in timer components — it prevents stale closure bugs
- Do not refactor form inputs from `useRef` to `useState` without a good reason — the ref approach is intentional for perf

---

## Common tasks

**Adding a new field to DailyPlan**: update the shape in `active-plan-slice.js`, the thunks in `active-plan-actions.js`, and any components that create/read the field.

**Adding a new dashboard view**: create a component under `src/components/Dashboards/`, add a route in `App.js`, and add a nav link in `MainNavigation.js`.

**Changing Firebase data structure**: update the relevant thunk in `*-actions.js` (the path strings are inline in fetch/PUT calls).

**Testing locally**: `npm start` — runs on `localhost:3000`. No `.env` needed; config is hardcoded.
