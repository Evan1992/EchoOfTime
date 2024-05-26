/* ========== import React and React hooks ========== */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/* ========== import React components ========== */
import NewLongTermPlan from '../NewPlan/NewLongTermPlan';
import ShortTermPlans from '../ShortTermPlans/ShortTermPlans';

/* ========== import other libraries ========== */
import { fetchPlanData, archivePlanData } from '../../../store/slices/active-plan-actions';

/* ========== import css ========== */
import classes from './LongTermPlan.module.css';

const LongTermPlan = () => {
    const dispatch = useDispatch();
    const plan = useSelector((state) => state.activePlan);

    // get the data from database as soon as user visit the home page
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
            <ShortTermPlans />
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