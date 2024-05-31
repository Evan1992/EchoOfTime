/* ========== import React and React hooks ========== */
import React from 'react';
import { useSelector } from 'react-redux';

/* ========== import React components ========== */
import NewDailyPlan from './NewDailyPlan';
import DailyPlan from './DailyPlan';

/* ========== import other libraries ========== */
import Container from 'react-bootstrap/Container';

/* ========== import css ========== */
import classes from './DailyPlans.module.css';

const DailyPlans = () => {
    const plan = useSelector((state) => state.activePlan);

    let ordered_daily_plans = []
    let ordered_daily_plans_id = []
    if(plan.short_term_plan.daily_plans !== undefined) {
        for(const id in plan.short_term_plan.daily_plans) {
            ordered_daily_plans_id.push(id)
            ordered_daily_plans.push(plan.short_term_plan.daily_plans[id])
        }
    }

    return (
        <React.Fragment>
            {/* Component for all active plans */}
            <div className={classes.plans}>
                <Container fluid className={classes.container}>
                    {
                        ordered_daily_plans &&
                        ordered_daily_plans.map((dailyPlan, index) => {
                            return <DailyPlan
                                        key={ordered_daily_plans_id[index]}
                                        id={ordered_daily_plans_id[index]}
                                        plan={dailyPlan}
                                    />
                        })
                    }
                    <NewDailyPlan />
                </Container>
            </div>
        </React.Fragment>
    )
}

export default DailyPlans



/* ========== Learning ========== */
/* Rendering list */
// Reference: https://react.dev/learn/rendering-lists
// When displaying multiple similar components from a collection of data,
// we can use the JavaScript array methods filter() and map() to manipulate
// an array of data