/* ========== import React and React hooks ========== */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

/* ========== import React components ========== */
import InlineEdit from '../../UI/InlineEdit';
import DailyPlans from '../DailyPlans/DailyPlans';
import ShortTermPlanContent from './ShortTermPlanContent';

/* ========== import other libraries ========== */
import { activePlanActions } from '../../../store/slices/active-plan-slice';

/* ========== import css ========== */
import classes from './ShortTermPlan.module.css';

const ShortTermPlan = () => {
    const dispatch = useDispatch();
    const plan = useSelector((state) => state.activePlan);
    const daily_plans = (plan.short_term_plan.daily_plans !== undefined) ? plan.short_term_plan.daily_plans : [];

    const addShortTermPlanHandler= (inputTitle, inputDescription) => {
        const dateToday = new Date().toLocaleDateString();
        const split = dateToday.split("/");
        const dateTodayISO = "".concat(split[2], "-", split[0], "-", split[1]);
        dispatch(activePlanActions.addShortTermPlan({
            short_term_plan:{
                title: inputTitle,
                description: inputDescription,
                date: dateTodayISO,
                daily_plans: daily_plans
            }
        }))
    }

    const archivePlanHandler = () => {
        dispatch(activePlanActions.removeShortTermPlan());
    }

    return (
        <React.Fragment>
            {/* Show short_term_plan */}
            <section className={classes.card}>
                <div>
                    <h3>Sprint</h3>
                    <button onClick={archivePlanHandler}>Done</button>
                </div>
                <ShortTermPlanContent
                    inputTitle={plan.short_term_plan.title}
                    inputDescription={plan.short_term_plan.description}
                    postPlan={addShortTermPlanHandler}
                />
            </section>

            {/* Show daily_plans if short_term_plan exists */}
            {plan.short_term_plan.title &&
                <DailyPlans />
            }
        </React.Fragment>   
    )
}

export default ShortTermPlan

/* ========== Learning ========== */
/* Posting data and asynchronous call */
// If we write code like below, the database won't be updated and the page get refreshed.
// This is because the http request is sent to the backend, but before the response get back
// to the requester, the page is already refreshed, so the TCP handshake is not completely done.
    /* 
        instance.put(...);
        window.location.reload();
    */
