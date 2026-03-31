import React, { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

/* ========== import React components ========== */
import Layout from './components/Layout/Layout';
import Sprint from './components/Dashboards/Sprint/Sprint';
import TodayPlans from './components/Dashboards/Today/TodayPlans';
import Backlog from './components/Dashboards/Backlog/Backlog';
import LongTermPlan from './components/Plans/LongTermPlans/LongTermPlan';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage.js';
import AuthContext, { refreshIdToken } from './store/auth-context';
import { activePlanActions } from './store/slices/active-plan-slice';
import { backlogPlanActions } from './store/slices/backlog-plan-slice';
import { fetchPlanData as fetchActivePlan } from './store/slices/active-plan-actions';
import { fetchPlanData as fetchBacklogPlan } from './store/slices/backlog-plan-actions';
import useFirebaseSSE from './hooks/useFirebaseSSE';

/* ========== import css ========== */
import './App.css';

/**
 * Firebase may return objects with numeric string keys instead of arrays when
 * array elements have been deleted and re-indexed. This normalises them back.
 */
const toArray = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === 'object') return Object.values(val);
    return [];
};

/**
 * Normalizes a short_term_plan object from a Firebase SSE payload into the shape
 * the Redux store expects.
 *
 * Two problems this solves:
 *  1. Firebase can return arrays as objects with numeric string keys
 *     (e.g. {"0": {...}, "1": {...}}) when elements have been deleted and re-added.
 *     toArray() converts those back to proper JS arrays.
 *  2. todo_everyday may be absent on plans created before that field existed.
 *     A safe default is substituted so components that iterate over
 *     todo_everyday_plans never receive undefined.
 */
const normalizeShortTermPlan = (stp) => {
    if (!stp) return { title: '', description: '', date: null, daily_plans: [], todo_everyday: { dateOfToday: '', todo_everyday_plans: [] } };
    return {
        ...stp,
        daily_plans: toArray(stp.daily_plans),
        todo_everyday: stp.todo_everyday
            ? { ...stp.todo_everyday, todo_everyday_plans: toArray(stp.todo_everyday.todo_everyday_plans) }
            : { dateOfToday: '', todo_everyday_plans: [] }
    };
};

const normalizeToday = (today) => {
    if (!today) return { date: '', today_plans: [], used_time: 0 };
    return { ...today, today_plans: toArray(today.today_plans) };
};

const App = () => {
    const authCtx = useContext(AuthContext);
    const isLoggedIn = authCtx.isLoggedIn;
    const dispatch = useDispatch();

    // Separate token state for SSE so we can trigger reconnect on auth revocation
    // without relying on authCtx reference stability.
    const [sseToken, setSseToken] = useState(authCtx.token);

    // Keep a ref to the latest authCtx to avoid stale closures in handleAuthRevoked
    const authCtxRef = useRef(authCtx);
    useEffect(() => { authCtxRef.current = authCtx; }, [authCtx]);

    // Sync sseToken when the user logs in or out
    useEffect(() => {
        setSseToken(authCtx.token);
    }, [authCtx.token]);

    const handleAuthRevoked = async () => {
        const ctx = authCtxRef.current;
        if (!ctx.refreshToken) return;
        try {
            const refreshData = await refreshIdToken(ctx.refreshToken);
            ctx.login(refreshData.id_token, refreshData.refresh_token, refreshData.user_id);
            setSseToken(refreshData.id_token);
        } catch (err) {
            console.error('SSE token refresh failed:', err);
        }
    };

    const handleActivePlanPut = (payload) => {
        const { path, data } = payload;
        if (!data) return;

        if (path === '/') {
            dispatch(activePlanActions.addPlan({
                title: data.title,
                description: data.description,
                date: data.date,
                changed: false,
                today: normalizeToday(data.today),
                short_term_plan: normalizeShortTermPlan(data.short_term_plan)
            }));
        } else if (path === '/short_term_plan') {
            dispatch(activePlanActions.setShortTermPlan(normalizeShortTermPlan(data)));
        } else if (path === '/short_term_plan/daily_plans') {
            dispatch(activePlanActions.setDailyPlans(toArray(data)));
        } else if (path === '/today') {
            dispatch(activePlanActions.setToday(normalizeToday(data)));
        } else if (path === '/today/today_plans') {
            dispatch(activePlanActions.setTodayPlans(toArray(data)));
        } else {
            // Unrecognised sub-path — do a full refetch to stay in sync
            dispatch(fetchActivePlan(authCtxRef.current));
        }
    };

    const handleBacklogPut = (payload) => {
        const { path, data } = payload;
        if (path === '/') {
            dispatch(backlogPlanActions.addPlan({ daily_plans: toArray(data?.daily_plans) }));
        } else if (path === '/daily_plans') {
            dispatch(backlogPlanActions.addPlan({ daily_plans: toArray(data) }));
        }
    };

    const handleActivePlanPatch = () => {
        dispatch(fetchActivePlan(authCtxRef.current));
    };

    const handleBacklogPatch = () => {
        dispatch(fetchBacklogPlan(authCtxRef.current));
    };

    const activePlanPath = isLoggedIn ? `/${authCtx.userID}/active_plan` : null;
    const backlogPath = isLoggedIn ? `/${authCtx.userID}/backlog` : null;

    useFirebaseSSE({
        path: activePlanPath,
        token: sseToken,
        onPut: handleActivePlanPut,
        onPatch: handleActivePlanPatch,
        onAuthRevoked: handleAuthRevoked,
    });

    useFirebaseSSE({
        path: backlogPath,
        token: sseToken,
        onPut: handleBacklogPut,
        onPatch: handleBacklogPatch,
        onAuthRevoked: handleAuthRevoked,
    });

    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    {!isLoggedIn && (
                        <Route path='/' exact element={<HomePage />} />
                    )}

                    {!isLoggedIn && (
                        <Route path='/auth' element={<AuthPage />} />
                    )}

                    {isLoggedIn && (
                        <Route path='/' element={<LongTermPlan />} />
                    )}
                    {isLoggedIn && (
                        <Route path='/sprint' element={<Sprint />} />
                    )}
                    {isLoggedIn && (
                        <Route path='/today' element={<TodayPlans />} />
                    )}
                    {isLoggedIn && (
                        <Route path='/overview' element={<LongTermPlan />} />
                    )}
                    {isLoggedIn && (
                        <Route path='/backlog' element={<Backlog />} />
                    )}
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
