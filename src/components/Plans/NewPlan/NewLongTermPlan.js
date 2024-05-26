/* ========== import React and React hooks ========== */
import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/* ========== import other libraries ========== */
import { activePlanActions } from '../../../store/slices/active-plan-slice';
import { sendPlanData } from '../../../store/slices/active-plan-actions';

/* ========== import css ========== */
import classes from './NewLongTermPlan.module.css';


const NewLongTermPlan = () => {
    const plan = useSelector((state) => state.activePlan);
    const dispatch = useDispatch();

    let inputTitle = useRef();
    let inputDescription = useRef();

    useEffect(() => {
        if(plan.changed) {
            dispatch(sendPlanData(plan));
        }
    }, [plan, dispatch])

    const postPlanHandler = (event) => {
        event.preventDefault();

        dispatch(
            activePlanActions.addPlan({
                title: inputTitle.current.value,
                description: inputDescription.current.value,
                date: new Date().toISOString().slice(0,10),
                short_term_plans: {}
            })
        )
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

/* useEffect() to update the database */
// plan is a global variable from the redux slice, as a result,
// whenever plan changes, useEffect() will be invoked and sendPlanData()
// will be called, then the database will be updated