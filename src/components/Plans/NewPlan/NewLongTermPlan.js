/* ========== import React and React hooks ========== */
import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/* ========== import other libraries ========== */
import { sendPlanData } from '../../../store/slices/active-plan-actions';

/* ========== import css ========== */
import classes from './NewLongTermPlan.module.css';


const NewLongTermPlan = () => {
    const plan = useSelector((state) => state.activePlan);
    const dispatch = useDispatch();

    let inputTitle = useRef();
    let inputDescription = useRef();

    const postPlanHandler = (event) => {
        event.preventDefault();
        const target = {
            title: inputTitle.current.value,
            description: inputDescription.current.value,
            date: new Date().toISOString().slice(0,10),
            short_term_plans: []
        }
        dispatch(sendPlanData(target));
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
                    <button>Submit</button>
                </div>
            </form>
        </section>
    )
}

export default NewLongTermPlan


/* ========== Learning ========== */
/* html tag textarea */
// Reference: https://www.w3schools.com/tags/tag_textarea.asp