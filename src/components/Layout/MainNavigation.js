import { useContext } from 'react';
import { Link } from 'react-router-dom';

import AuthContext from '../../store/auth-context'
import classes from './MainNavigation.module.css'

const MainNavigation = () => {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;
  
  const logoutHandler = () => {
    authCtx.logout();
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
              <Link to='/today'>Today</Link>
            </li>
            <li>
              <Link to='/overview'>Overview</Link>
            </li>
            <li>
              <Link to='/backlog'>Backlog</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default MainNavigation