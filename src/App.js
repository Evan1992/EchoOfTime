import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

/* ========== import React components ========== */
import Layout from './components/Layout/Layout';
import TodayPlans from './components/Dashboards/Today/TodayPlans';
import Overview from './components/Dashboards/Overview/Overview';
import Backlog from './components/Dashboards/Backlog/Backlog';
import LongTermPlan from './components/Plans/LongTermPlans/LongTermPlan';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage.js';
import AuthContext from './store/auth-context';

/* ========== import css ========== */
import './App.css';

const App = () => {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;
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
              <Route path='/today' element={<TodayPlans />} />
            )}
            {isLoggedIn && (
              <Route path='/overview' element={<Overview />} />
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
