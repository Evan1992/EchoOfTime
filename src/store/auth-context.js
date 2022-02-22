import React, { useState } from 'react'

const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    userID: '',
    login: (token) => {},
    logout: () => {}
})

export const AuthContextProvider = (props) => {
    const initialToken = localStorage.getItem('token');
    const initialUserID = localStorage.getItem('userID')
    const [token, setToken] = useState(initialToken);
    const [userID, setUserID] = useState(initialUserID);
    console.log("initialToken is: ", initialToken);
    console.log("token in auth-context.js is: ", token);
    
    const userIsLoggedIn = !!token;
    
    const loginHandler = (token, userID) => {
        setToken(token);
        setUserID(userID);
        localStorage.setItem('token', token);
        localStorage.setItem('userID', userID);
    }
    
    const logoutHandler = () => {
        setToken(null);
        localStorage.removeItem('token');
    }
    
    const contextValue = {
        token: token,
        isLoggedIn: userIsLoggedIn,
        userID: userID,
        login: loginHandler,
        logout: logoutHandler
    }
    
    return (
        <AuthContext.Provider value={contextValue}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContext