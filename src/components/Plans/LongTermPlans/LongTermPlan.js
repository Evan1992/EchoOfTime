/* ========== import React and React hooks ========== */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/* ========== import React components ========== */
import NewLongTermPlan from '../NewPlan/NewLongTermPlan';
import ShortTermPlan from '../ShortTermPlans/ShortTermPlan';

/* ========== import other libraries ========== */
import { fetchPlanData, archivePlanData, sendPlanData } from '../../../store/slices/active-plan-actions';

/* ========== import css ========== */
import classes from './LongTermPlan.module.css';

const LongTermPlan = () => {
    const dispatch = useDispatch();
    const plan = useSelector((state) => state.activePlan);

    // Send the data to database after user input
    useEffect(() => {
        if(plan.changed === true) {
            dispatch(sendPlanData(plan));
        }
    }, [dispatch, plan])

    // Get the data from database as soon as user visit the home page
    useEffect(() => {
        dispatch(fetchPlanData());
    }, [dispatch])

    // Migrate the plan from active_plan to archived_plans while deleting the active_plan from database
    const archivePlan = () => {
        dispatch(archivePlanData(plan));
    }

    const showLongTermPlan = (
        <div>
            <section className={classes.card}>
                <div>
                    <h3>Marathon</h3>
                    <button onClick={archivePlan}>Done</button>
                </div>
                <h5>{plan.title}</h5>
                <div>{plan.description}</div>
            </section>
            <ShortTermPlan />
        </div>
    )

    return (
        <React.Fragment>
            {plan.title === "" && <NewLongTermPlan />}
            {plan.title !== "" && showLongTermPlan}
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
        dispatch(archivePlanData(plan));
    }
*/
// The above code snippet does NOT perform side effect within useEffect(),
// as a result, user have to wait for the communication to database to complete,
// then see the UI changes