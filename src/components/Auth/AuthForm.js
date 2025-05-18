import { useState, useRef, useContext } from 'react';

/* ========== import React components ========== */
import AuthContext from '../../store/auth-context';

/* ========== import css ========== */
import classes from './AuthForm.module.css';
import { useNavigate } from 'react-router-dom';

const AuthForm = (props) => {
    const emailInputRef    = useRef();
    const passwordInputRef = useRef();

    // Consume the context by using the useContext hook
    const authCtx = useContext(AuthContext);

    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const switchAuthModeHandler = () => {
        setIsLogin((prevState) => !prevState);
    }

    const submitHandler = (event) => {
        event.preventDefault();

        const enteredEmail = emailInputRef.current.value;
        const enteredPassword = passwordInputRef.current.value

        setIsLoading(true)
        let url;
        if(isLogin) {
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDmXWs4VOOgIxnptitzMKI3tNOSjP67TfI'; 
        } else {
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDmXWs4VOOgIxnptitzMKI3tNOSjP67TfI';
        }
        fetch(
            url,
            {
                method: 'POST',
                body: JSON.stringify({
                    email: enteredEmail,
                    password: enteredPassword,
                    returnSecureToken: true
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then(res => {
            setIsLoading(false);
            if(res.ok) {
                return res.json();
            } else {
                return res.json().then(data => {
                    // show an error modal
                    let errorMessage = 'Authentication failed!'
                    if(data && data.error && data.error.message) {
                        errorMessage = data.error.message;
                    }
                    throw new Error(errorMessage);
                })
            }
        })
        .then(data => {
            authCtx.login(data.idToken, data.localId);
            // Redirect to home page after log in successfully
            navigate('/');
        })
        .catch(err => {
            alert(err.message);
        })
    }

    return(
        <section className={classes.auth}>
            <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
            <form onSubmit={submitHandler}>
                <div className={classes.control}>
                    <label htmlFor='email'>Your email</label>
                    <input 
                        type='email' 
                        id='email' 
                        required 
                        ref={emailInputRef} 
                    />
                </div>
                <div className={classes.control}>
                    <label htmlFor='password'>Your Password</label>
                    <input
                        type='password'
                        id='password'
                        required
                        ref={passwordInputRef}
                    />
                </div>

                <div className={classes.actions}>
                    {!isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
                    { isLoading && <p>Sending request...</p> }
                    <button 
                        type='button' 
                        className={classes.toggle}
                        onClick={switchAuthModeHandler}
                    >
                        {isLogin ? 'Create new account' : 'Login with existing account' }
                    </button>
                </div>
            </form>
        </section>
    )
}

export default AuthForm;

/* ========== Learning ========== */
/* event.preventDefault() */
// a preventDefault is called on the event when submitting the form to prevent
// a browser reload/refresh.
// Why is form submit reloading the browseer?
// All native HTML elements come with their internal behavior. For instance, input
// elements store their internal state. The same applies for a form element which
// has a submit event that is invoked via a submit button element.
/* Web API Key  */
// Key to access Firebase API can be found at Firebase console -> Project Overview -> Project settings
// The registered users can be found at Firebase console -> Authentication -> Users