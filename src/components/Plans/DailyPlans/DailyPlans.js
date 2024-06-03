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

    return (
        <React.Fragment>
            {/* Component for all active plans */}
            <div className={classes.plans}>
                <Container fluid className={classes.container}>
                    {
                        plan.short_term_plan.daily_plans &&
                        plan.short_term_plan.daily_plans.map((dailyPlan, index) => {
                            let show_children = false;
                            if(dailyPlan.has_children) {
                                if(index+1 < plan.short_term_plan.daily_plans.length && plan.short_term_plan.daily_plans[index+1].show_plan) {
                                    show_children = true;
                                }
                            }
                            if(dailyPlan.show_plan) {
                                return <DailyPlan
                                    key={dailyPlan.id}
                                    index={index} // used to decide where to insert the new daily plan to daily_plans
                                    id={dailyPlan.id}
                                    plan={dailyPlan}
                                    rank={dailyPlan.rank}
                                    show_children={show_children}
                                />
                            }
                            return <div key={dailyPlan.id} />
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

/* Each child in a list should have a unique "key" prop */
// We cannot use index directly or daily_plan_ids[index] indirectly as the key,
// if so, although the key is provided, we still see the error