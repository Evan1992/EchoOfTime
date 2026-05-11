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
  focusTimer: {
    focusTime,             // task's running total seconds (baseSeconds + elapsed)
    sessionElapsed,        // seconds elapsed in the current session (starts from 0, shown in Focus)
    isTimerActive,         // boolean — is any timer running?
    timerHolder,           // plan id that owns the active timer (null if none)
    startTime,             // Date.now() of the current base period (reset on tab-switch)
    baseSeconds,           // task seconds at the start of the current base period
    activationBaseSeconds  // task seconds when timer was first started (never reset mid-session)
  }
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

### Daily Rollover (2:00 AM)

When the calendar day changes (at 2:00 AM), two Firebase nodes need to be refreshed so the Today and Sprint pages show correct data for the new day. This is handled automatically by a timer in `App.js` that fires regardless of which page is open.

**What triggers it**: A `setTimeout` scheduled in `App.js` fires at the next 2:00 AM. After firing it immediately re-arms itself for the following day. The timer starts when the user logs in and is cancelled on logout.

**What it does** (`performRollover` in `App.js`):
1. **`refreshToday`** — rebuilds `today.today_plans` from `short_term_plan.daily_plans` (tasks whose date is now today) and `todo_everyday_plans` (recurring tasks, reset to `completed: false`), then PUTs `{ date: today, today_plans, used_time: 0 }` to `/{uid}/active_plan/today.json`.
2. **`refreshTodoEveryday`** — resets each todo_everyday plan to `completed: false` and `date: today`, then PUTs to `/{uid}/active_plan/short_term_plan/todo_everyday.json`.

**How Redux state is updated**: Both writes go to Firebase; the SSE subscription in `App.js` picks them up and dispatches `setToday` and a full `fetchActivePlan` refetch respectively, keeping all pages in sync without a manual refresh.

**Stale-closure safety**: `performRollover` reads `plan` and `authCtx` from refs (`planRef`, `authCtxRef`) that are kept up to date on every render, so the callback always sees the latest state even after hours of inactivity.

**Fallback on initial load**: `TodayPlans.js` still checks `!isToday(plan.today.date)` after `fetchPlanData` returns. This covers the case where the app was reopened (page refresh) after missing the 2:00 AM timer.

### Global Persistent Timer

EchoOfTime supports a single active timer that persists across tab switches. Only one task can be timed at a time across all pages (Today, Sprint, Backlog).

#### Problem with the naive approach

Each plan component (`TodayPlan`, `DailyPlan`) previously owned its timer state locally and ran a `setInterval` inside a child `Timer.js` component. Switching tabs unmounted the component tree, killing the interval and stopping the timer.

#### Design

**Two key architectural moves:**

**1. Timer state lives in `focusTimer` Redux slice (global, survives tab switches)**

| Field | Purpose |
|---|---|
| `isTimerActive` | Is any timer running? |
| `timerHolder` | Plan id that owns the timer (`null` if none) |
| `startTime` | `Date.now()` when the current base period started; reset on tab-switch |
| `baseSeconds` | Task's saved seconds at the start of the current base period |
| `activationBaseSeconds` | Task's seconds when first activated; never reset — used to derive `sessionElapsed` |
| `focusTime` | `baseSeconds + elapsed` — the task's live running total |
| `sessionElapsed` | `focusTime - activationBaseSeconds` — how long this session has run (shown in `Focus.js`) |

**2. The interval lives in `App.js` (root component, never unmounts)**

```javascript
// App.js — fires every second whenever isTimerActive is true
useEffect(() => {
    if (!focusTimer.isTimerActive) return;
    const { startTime, baseSeconds } = focusTimer;
    const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        dispatch(focusTimerActions.tickTimer({ seconds: baseSeconds + elapsed }));
    }, 1000);
    return () => clearInterval(interval);
}, [focusTimer.isTimerActive, focusTimer.startTime, focusTimer.baseSeconds, dispatch]);
```

`Timer.js` reads `focusTime` from Redux for display (no local interval). `Focus.js` reads `sessionElapsed` from Redux.

#### Tab-switch: save without stopping

When the user leaves a tab, the plan component unmounts and its cleanup runs:

```
1. elapsed    = floor(now - startTime)
2. currentSecs = baseSeconds + elapsed
3. dispatch updateTime(currentSecs)        → update Redux activePlan (no DB write)
4. dispatch resetTimerBase(currentSecs, now) → slide base forward, timer keeps running
```

`deactivateTimer` is never called on unmount. The App.js interval sees `startTime`/`baseSeconds` change, restarts with the new values, and continues ticking. When the user returns, `Timer.js` reads the live `focusTime` immediately.

**No Firebase writes on tab-switch** — persistence only happens when the user explicitly stops the timer.

#### Explicit stop

```
1. elapsed     = floor(now - startTime)
2. currentSecs = baseSeconds + elapsed
3. dispatch updateTime(currentSecs)        → update Redux activePlan
4. setTodayPlanChanged = true              → triggers sendDailyPlanData + updateToday (DB write)
5. dispatch deactivateTimer(currentSecs)   → isTimerActive = false, interval stops
```

#### Mutual exclusion

Before starting a timer, every plan component checks:

```javascript
if (isTimerActive && timerHolder !== myPlanId) → alert and block
```

Since both fields are global Redux state, this prevents two timers running simultaneously across any page.

#### sessionElapsed drift prevention

`sessionElapsed` is derived in the reducer as `focusTime - activationBaseSeconds` rather than being computed independently from wall-clock time. This guarantees it stays perfectly in sync with `focusTime` across any number of tab switches — no drift accumulates.

#### Data flow summary

```
User clicks start
  → dispatch activateTimer  (sets isTimerActive, timerHolder, startTime, baseSeconds)
  → App.js interval starts

Every second (App.js)
  → dispatch tickTimer  → focusTime++, sessionElapsed++
  → Timer.js reads focusTime  → task timer display updates
  → Focus.js reads sessionElapsed  → focus display updates

User switches tab
  → plan component unmounts
  → cleanup: update Redux, dispatch resetTimerBase  (no DB write)
  → App.js interval restarts with new base — timer never stops

User clicks stop
  → calculate currentSecs from Redux
  → dispatch updateTime, setTodayPlanChanged  → Redux + Firebase write
  → dispatch deactivateTimer  → interval stops
```

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
