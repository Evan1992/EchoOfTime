import React, { useContext, useEffect } from 'react';
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
import AuthContext from './store/auth-context';
import { fetchPlanData as fetchActivePlan } from './store/slices/active-plan-actions';
import { fetchPlanData as fetchBacklogPlan } from './store/slices/backlog-plan-actions';

/* ========== import css ========== */
import './App.css';

const App = () => {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoggedIn) return;
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        dispatch(fetchActivePlan(authCtx));
        dispatch(fetchBacklogPlan(authCtx));
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isLoggedIn, authCtx, dispatch]);

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
