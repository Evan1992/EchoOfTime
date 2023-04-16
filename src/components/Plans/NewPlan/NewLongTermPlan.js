/* ========== import React and React hooks ========== */
import React, { useState, useRef } from 'react'

/* ========== import other libraries ========== */
import axios from '../../../axios'

/* ========== import css ========== */
import classes from './NewLongTermPlan.module.css';


const NewLongTermPlan = () => {
    let inputTitle = useRef();
    let inputDescription = useRef();
    const [isLoading, setIsLoading] = useState(false);

    const postPlanHandler= (event) => {
        event.preventDefault();
        
        const enteredTitle = inputTitle.current.value;
        const enteredDescription = inputDescription.current.value;

        setIsLoading(true);

        const target = {
            complete: false,
            title: enteredTitle,
            description: enteredDescription,
            date: new Date().toISOString().slice(0,10)
        };
        axios.post(`/long_term_plans.json`, target)
        .then(res => {
            setIsLoading(false);
            
            // Refresh the page after posting the data
            window.location.reload();
        })
    }

    return (
        <section className={classes.card}>
            <h1>Marathon</h1>
            <form onSubmit = {postPlanHandler}>
                <div className={classes.control}>
                    <label htmlFor='title'>Title</label>
                    <input type="text" ref={inputTitle} required />
                </div>

                <div className={classes.control}>
                    <label htmlFor='description'>Description</label>
                    <textarea ref={inputDescription} rows="15" required />
                </div>

                <div className={classes.actions}>
                    {!isLoading && <button>Submit</button>}
                    {isLoading && <p>Sending request...</p>}
                </div>
            </form>
        </section>
    )
}

export default NewLongTermPlan


/* ========== Learning ========== */
/* html tag textarea */
// Reference: https://www.w3schools.com/tags/tag_textarea.asp
