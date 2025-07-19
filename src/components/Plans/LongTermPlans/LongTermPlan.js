/* ========== import React and React hooks ========== */
import React, { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/* ========== import React components ========== */
import NewLongTermPlan from '../NewPlan/NewLongTermPlan';
import ShortTermPlan from '../ShortTermPlans/ShortTermPlan';
import AuthContext from '../../../store/auth-context';

/* ========== import other libraries ========== */
import { isToday } from '../../../utilities';
import { fetchPlanData, archivePlanData, sendPlanData, refreshToday } from '../../../store/slices/active-plan-actions';

/* ========== import css ========== */
import classes from './LongTermPlan.module.css';

const LongTermPlan = () => {
    const authCtx = useContext(AuthContext);
    const dispatch = useDispatch();
    const plan = useSelector((state) => state.activePlan);
    const [fetched, setFetched] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Get the data from database as soon as user visit the home page
    useEffect(() => {
        // Check if the plan is already fetched
        if (plan.title === "") {
            dispatch(fetchPlanData(authCtx));
            setFetched(true);
        }
    }, [plan, authCtx, dispatch])

    // Send the data to database after user input
    useEffect(() => {
        if(plan.changed === true) {
            dispatch(sendPlanData(authCtx, plan));
        }
    }, [authCtx, dispatch, plan])

    // Update today if date fetched from database is not today
    useEffect(() => {
        if(fetched && plan.today.date !== "" && !isToday(plan.today.date)) {
            let new_today_plans = []
            for (const daily_plan of plan.short_term_plan.daily_plans) {
                if(isToday(daily_plan.date)) {
                    new_today_plans.push(daily_plan);
                }
            }
            dispatch(refreshToday(authCtx, new_today_plans));
        }
    }, [authCtx, dispatch, fetched, plan])

    const editPlanHandler = () => {
        setIsEditing(!isEditing);
    }

    // Migrate the plan from active_plan to archived_plans while deleting the active_plan from database
    const archivePlanHandler = () => {
        dispatch(archivePlanData(authCtx, plan));
    }

    const showLongTermPlan = (
        <React.Fragment>
            <section className={classes.card}>
                <div className={classes.header}>
                    <h3>Marathon</h3>
                    {plan.title.trim() !== "" && (
                        <React.Fragment>
                            <div className={classes.edit} onClick={editPlanHandler}>Edit</div>
                            <div className={classes.done} onClick={archivePlanHandler}>Done</div>
                        </React.Fragment>
                    )}
                </div>
                <h5>{plan.title}</h5>
                <div>{plan.description}</div>
            </section>
            <ShortTermPlan />
        </React.Fragment>
    )

    return (
        <React.Fragment>
            {
                (plan.title === "" || isEditing === true) ? (
                    <section className={classes.card}>
                        <NewLongTermPlan
                            inputTitle={plan.title}
                            inputDescription={plan.description}
                            editPlanHandler={editPlanHandler}
                        />
                    </section>
                ) : showLongTermPlan
            }
        </React.Fragment>
    )
}

export default LongTermPlan

/* ========== Learning ========== */
/* html tag span vs div */
// A div is a block element; a span is an inline element

/* useEffect() to update the database */
// plan is a global variable from the redux slice, as a result,
// whenever plan changes, useEffect() will be invoked and sendPlanData()
// will be called, then the database will be updated. We mutate the state
// in the component - NewLongTermPlan while perform the side effect
// sendPlanData() in this component
// Benefit: This will separate the process of updating global state and updating
// the database. As a result, the end user will see a fast UI change instead of
// waiting for the complete of database update.

/*
    const archivePlan = () => {
        dispatch(archivePlanData(authCtx.userID, plan));
    }
*/
// The above code snippet does NOT perform side effect within useEffect(),
// as a result, user have to wait for the communication to database to complete,
// then see the UI changes