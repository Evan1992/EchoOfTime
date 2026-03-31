# EchoOfTime — Design Document

## Overview

EchoOfTime (Sound of Time v2) is a hierarchical task planning and time-tracking web application. It organizes work across multiple time scales using a **Marathon > Sprint > Daily Task** hierarchy inspired by agile methodology.

**Core philosophy**: Break long-term goals into sprints, sprints into daily tasks, and track time spent on each task in real time.

---

## Architecture

### Tech Stack

| Layer | Technology |
|---|---|
| UI | React 18.3.1 + CSS Modules + Bootstrap 5 |
| Routing | React Router DOM 6 |
| State | Redux Toolkit 2 (global) + Context API (auth) |
| Backend/DB | Firebase Realtime Database |
| Auth | Firebase Authentication (email/password) |
| Icons | FontAwesome |
| Markdown | react-markdown |
| Timer | react-use-precision-timer |

### State Management

Hybrid approach:

- **Redux Toolkit** — three slices for app state:
  - `activePlan` — current Marathon/Sprint/Daily plan hierarchy, today's tasks, used time
  - `backlogPlan` — unscheduled tasks
  - `focusTimer` — current focus timer state
- **Context API** (`auth-context.js`) — authentication, Firebase token, refresh token, user ID

All Firebase operations are Redux **thunks** (async actions) in `*-actions.js` files, keeping slice reducers pure.

### Directory Layout

```
src/
├── pages/            # Top-level route pages (HomePage, PlansPage, AuthPage)
├── store/
│   ├── auth-context.js
│   └── slices/
│       ├── index.js                  # Store configuration
│       ├── active-plan-slice.js      # Reducers for active plan
│       ├── active-plan-actions.js    # Async thunks (Firebase R/W)
│       ├── backlog-plan-slice.js
│       ├── backlog-plan-actions.js
│       └── focus-timer-slice.js
├── components/
│   ├── UI/           # Generic (Backdrop, InlineEdit)
│   ├── Layout/       # Layout, MainNavigation, Footer
│   ├── Auth/         # AuthForm
│   ├── Plans/        # LongTermPlan, ShortTermPlan, DailyPlans, TodoEverydayPlans, TomorrowPreview, NewLongTermPlan
│   ├── Dashboards/   # Today, Sprint, Backlog dashboards
│   ├── Timer/        # Timer, TimerForFocus
│   ├── Rewards/      # Rewards
│   └── StartingPage/ # StartingPageContent
└── utilities.js      # Date helpers (isToday, etc.)
```

---

## Data Model

### Plan Hierarchy

```
LongTermPlan (Marathon)
└── short_term_plan (Sprint)
    ├── daily_plans[]       — all tasks in the sprint
    ├── todo_everyday{}     — recurring daily tasks
    └── today{}             — today's filtered view
```

### DailyPlan (task) shape

```javascript
{
  id: string,              // UUID
  rank: number,            // display order
  title: string,
  comment: string,
  date: string,            // "YYYY-MM-DD" or ""
  seconds: number,         // actual time spent
  expected_hours: number,
  expected_minutes: number,
  priority: number,        // 0 = highest
  parent_id: string?,      // for subtasks
  has_children: boolean,
  show_plan: boolean,      // UI expansion state
  completed: boolean
}
```

### Firebase Database Structure

```
/{userID}/
├── active_plan/
│   ├── title, description, date
│   ├── short_term_plan/
│   │   ├── title, description, date
│   │   ├── daily_plans[]
│   │   └── todo_everyday/
│   │       ├── dateOfToday
│   │       └── todo_everyday_plans[]
│   └── today/
│       ├── date
│       ├── today_plans[]
│       └── used_time (seconds)
├── backlog/
│   └── daily_plans[]
└── archived_plans/
    └── {planId}/
        ├── title, description, date
        └── short_term_plans[]
```

### Redux Store Shape

```javascript
{
  activePlan: {
    title, description, date,
    short_term_plan: { title, description, date, daily_plans[], todo_everyday{}, changed },
    today: { date, today_plans[], used_time },
    changed
  },
  backlogPlan: { daily_plans[] },
  focusTimer: { focusTime }  // seconds
}
```

---

## Firebase API Endpoints

Base: `https://echo-of-time-8a0aa-default-rtdb.firebaseio.com`

| Operation | Method | Path |
|---|---|---|
| Fetch active plan | GET | `/{uid}/active_plan.json?auth={token}` |
| Update active plan | PUT | `/{uid}/active_plan.json?auth={token}` |
| Update short-term plan | PUT | `/{uid}/active_plan/short_term_plan.json?auth={token}` |
| Update today | PUT | `/{uid}/active_plan/today.json?auth={token}` |
| Update todo everyday | PUT | `/{uid}/active_plan/short_term_plan/todo_everyday.json?auth={token}` |
| Delete active plan | DELETE | `/{uid}/active_plan.json?auth={token}` |
| Fetch backlog | GET | `/{uid}/backlog/daily_plans.json?auth={token}` |
| Update backlog | PUT | `/{uid}/backlog.json?auth={token}` |

Auth endpoints use Firebase Identity Toolkit. Token refresh is automatic on 401.

---

## Key Features

### Dashboards
- **Overview** — active Marathon + Sprint, plan management
- **Sprint** — all tasks in sprint, date assignment, priority, time tracking
- **Today** — today-filtered tasks, real-time timers, pie chart progress, sleep countdown (to 12:30 AM)
- **Backlog** — unscheduled tasks

### Time Tracking
- Per-task timer using `Date.now()` elapsed calculation
- Focus mode with dedicated `TimerForFocus` display
- Daily used-time accumulator (`used_time` in seconds)
- Visual pie chart comparing expected vs actual time
- Sleep countdown showing remaining work time before day end

### Task Management
- Hierarchical tasks (parent/child via `parent_id`)
- Inline editing (`InlineEdit.js`)
- Priority levels (0 = highest) with cascade to children
- Date picker (react-calendar)
- Recurring todos (`todo_everyday`) with daily reset
- Tomorrow preview
- Archive Marathon/Sprint on completion

---

## Notable Patterns

### Date Handling
- Storage format: `"YYYY-MM-DD"` (ISO)
- Display format: `"MM/DD/YYYY"` (local)
- Times before 2:00 AM are treated as the previous calendar day (overnight shift support)

### Form Pattern
`useRef` for form inputs (avoids re-renders on keystroke):
```javascript
const inputRef = useRef();
// Read: inputRef.current.value
```

### useLatest Pattern (`TodayPlan.js`)
Captures latest state value inside cleanup functions to avoid stale closure issues.

### Thunk Pattern
```javascript
export const fetchPlanData = (authCtx) => async (dispatch) => {
  const data = await fetch(...);
  dispatch(activePlanActions.addPlan(data));
};
```

### Constants
- `EATING_TIME_SECONDS` — reserved time budget for meals (excluded from work calculations)

### Cross-Device Sync
Real-time sync is implemented via **Firebase Server-Sent Events (SSE)** using the browser's native `EventSource`. Two persistent subscriptions are opened in `App.js` as soon as the user logs in:

- `/{userId}/active_plan` — streams the full active plan (Marathon + Sprint + Daily + Today)
- `/{userId}/backlog` — streams the backlog task list

**Hook**: `src/hooks/useFirebaseSSE.js` wraps `EventSource`. Callbacks (`onPut`, `onPatch`, `onAuthRevoked`) are stored in refs so they always reference the latest version without reopening the connection. The connection is only recreated when `path` or `token` changes.

**Event handling**:
- `put` events carry `{ path, data }`. `App.js` dispatches the appropriate Redux action based on `path` (`/` → `addPlan`, `/short_term_plan` → `setShortTermPlan`, `/today` → `setToday`).
- `patch` events are currently no-ops (Firebase sends `put` for all writes made by this app).
- `cancel` events indicate auth revocation — the token is refreshed via `refreshIdToken`, `authCtx.login` is called, and `sseToken` state is updated, which triggers automatic reconnection.

**Normalization**: Firebase SSE payloads can return arrays as objects with numeric string keys when elements have been deleted and re-added. `normalizeShortTermPlan` and `normalizeToday` in `App.js` convert these back to proper JS arrays before dispatching to Redux.

**Fallback initial fetch**: `TodayPlans.js` still calls `fetchPlanData` if `plan.title === ""` (i.e. the SSE initial `put` has not yet arrived when the component mounts).

---

## Authentication

- Email/password sign-up/login via Firebase
- Tokens stored in `localStorage` (`token`, `refreshToken`, `userID`)
- Automatic refresh on 401 responses
- `AuthContext` wraps the entire app; protected routes use `isLoggedIn`

---

## Build & Deployment

```bash
npm install   # install deps
npm start     # dev server at localhost:3000
npm run build # production build → /build
```

- CRA (Create React App) webpack-based build
- Static SPA — deploy to Netlify, Vercel, Firebase Hosting, or GitHub Pages
- PWA manifest present but not fully configured
