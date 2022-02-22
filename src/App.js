import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

/* ========== import React components ========== */
import Layout from './components/Layout/Layout';
import Plans from './components/Plans/Plans';
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
            <Route path='/plans' element={<Plans />} />
          )}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
