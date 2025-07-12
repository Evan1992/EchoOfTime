import { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';

import AuthContext from '../../store/auth-context'
import classes from './MainNavigation.module.css'

const MainNavigation = () => {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);

  const logoutHandler = () => {
    authCtx.logout();
  }

  const handleLinkClick = (link) => {
    setActiveTab(link);
  }
  
  return (
    <header className={classes.header}>
      <div className={classes.topNav}>
        <Link to="/">
          <div className={classes.logo}> EchoOfTime </div>
        </Link>
        <nav>
          <ul>
            {!isLoggedIn && (
              <li>
                <Link to='/auth'>Login</Link>
              </li>
            )}
            {isLoggedIn && (
              <li>
                <button onClick={logoutHandler}>Logout</button>
              </li>
            )}
          </ul>
        </nav>
      </div>
      <div className={classes.mainNav}>
        <nav>
          <ul>
            <li>
              <Link
                to='/overview'
                className={activeTab === '/overview' ? classes.active : ''}
                onClick={() => handleLinkClick('/overview')}>
                Overview
              </Link>
            </li>
            <li>
              <Link
                to='/today'
                className={activeTab === '/today' ? classes.active : ''}
                onClick={() => handleLinkClick('/today')}>
                Today
              </Link>
            </li>
            <li>
              <Link
                to='/backlog'
                className={activeTab === '/backlog' ? classes.active : ''}
                onClick={() => handleLinkClick('/backlog')}>
                Backlog
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default MainNavigation