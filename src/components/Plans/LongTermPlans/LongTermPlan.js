/* ========== import React and React hooks ========== */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/* ========== import React components ========== */
import NewLongTermPlan from '../NewPlan/NewLongTermPlan';

/* ========== import other libraries ========== */
import { fetchPlanData } from '../../../store/slices/active-plan-actions';

/* ========== import css ========== */
import classes from './LongTermPlan.module.css';

const LongTermPlan = () => {
    const dispatch = useDispatch();
    const plan = useSelector((state) => state.activePlan);

    useEffect(() => {
        dispatch(fetchPlanData());
    }, [dispatch])

    const archivePlan = () => {
        // TODO
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