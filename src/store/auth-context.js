import React, { useState } from 'react'

/* ========== import other libraries ========== */
import axios from 'axios';

const AuthContext = React.createContext({
    token: '',
    refreshToken: '',
    isLoggedIn: false,
    userID: '',
    firebase: null,
    login: () => {},
    logout: () => {}
})

export const AuthContextProvider = (props) => {
    const initialToken = localStorage.getItem('token');
    const initialRefreshToken = localStorage.getItem('refreshToken');
    const initialUserID = localStorage.getItem('userID');
    const [token, setToken] = useState(initialToken);
    const [refreshToken, setRefreshToken] = useState(initialRefreshToken);
    const [userID, setUserID] = useState(initialUserID);
    const isLoggedIn = !!token;

    // Given different users, call different database endpoints
    let firebase = axios.create({
        timeout: 5000,
        baseURL: `https://echo-of-time-8a0aa-default-rtdb.firebaseio.com/${userID}`
    });

    const loginHandler = (token, refreshToken, userID) => {
        setToken(token);
        setRefreshToken(refreshToken);
        setUserID(userID);
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userID', userID);
    }

    const logoutHandler = () => {
        setToken(null);
        setRefreshToken(null);
        setUserID(null);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userID');
    }

    const contextValue = {
        token: token,
        refreshToken: refreshToken,
        isLoggedIn: isLoggedIn,
        userID: userID,
        firebase: firebase,
        login: loginHandler,
        logout: logoutHandler
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {props.children}
        </AuthContext.Provider>
    )
}

export const refreshIdToken = async (refreshToken) => {
    const url = `https://securetoken.googleapis.com/v1/token?key=AIzaSyDmXWs4VOOgIxnptitzMKI3tNOSjP67TfI`;
    const response = await axios.post(url, {
        grant_type: 'refresh_token',
        refresh_token: refreshToken
    });
    if (response.status !== 200) throw new Error('Failed to refresh token');
    return response.data;
}

export default AuthContext