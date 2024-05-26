/* ========== import React and React hooks ========== */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

/* ========== import React components ========== */
import InlineEdit from '../../UI/InlineEdit';

/* ========== import other libraries ========== */
import { activePlanActions } from '../../../store/slices/active-plan-slice';

/* ========== import css ========== */
import classes from './ShortTermPlans.module.css';

const ShortTermPlans = (props) => {
    const dispatch = useDispatch();
    const plan = useSelector((state) => state.activePlan);

    const addShortTermPlanHandler= (inputTitle, inputDescription) => {
        dispatch(activePlanActions.addShortTermPlan({
            short_term_plan:{
                title: inputTitle,
                description: inputDescription,
                date: new Date().toISOString().slice(0,10),
                daily_plans: []
            }
        }))
    }

    const archivePlanHandler = () => {
        // TODO
    }

    return (
        <React.Fragment>
            {/* Show short_term_plan */}
            <section className={classes.card}>
                <div>
                    <h3>Sprint</h3>
                    <button onClick={archivePlanHandler}>Done</button>
                </div>
                <InlineEdit
                    inputTitle={plan.short_term_plan.title}
                    inputDescription={plan.short_term_plan.description}
                    postPlan={addShortTermPlanHandler}
                />
            </section>
        </React.Fragment>   
    )
}

export default ShortTermPlans

/* ========== Learning ========== */
/* Posting data and asynchronous call */
// If we write code like below, the database won't be updated and the page get refreshed.
// This is because the http request is sent to the backend, but before the response get back
// to the requester, the page is already refreshed, so the TCP handshake is not completely done.
    /* 
        instance.put(...);
        window.location.reload();
    */
