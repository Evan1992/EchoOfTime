/* ========== import React and React hooks ========== */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/* ========== import React components ========== */
import NewDailyPlan from './NewDailyPlan';
import DailyPlan from './DailyPlan';
import TodayPlans from '../TodayPlans/TodayPlans';
import TodayPlanSummary from '../TodayPlans/TodayPlanSummary';
import Focus from '../../Focus/Focus';

/* ========== import other libraries ========== */
import Container from 'react-bootstrap/Container';
import { isToday, isTomorrow } from '../../../utilities';
import { sendDailyPlanData, sendPlanData } from '../../../store/slices/active-plan-actions';

/* ========== import css ========== */
import classes from './DailyPlans.module.css';
import TomorrowPlanSummary from '../TomorrowPlans/TomorrowPlanSummary';


const DailyPlans = () => {
    const [planDeleted, setPlanDeleted] = useState(false);
    const dispatch = useDispatch();
    const plan = useSelector((state) => state.activePlan);

    const todayPlans = [];
    const tomorrowPlans = []
    if(plan.short_term_plan.daily_plans !== undefined) {
        for(const daily_plan of plan.short_term_plan.daily_plans) {
            if(isToday(daily_plan.date)) {
                todayPlans.push(daily_plan);
            }
            if(isTomorrow(daily_plan.date)) {
                tomorrowPlans.push(daily_plan)
            }
        }
    }

    useEffect(() => {
        if(planDeleted === true) {
            dispatch(sendDailyPlanData(plan))
            dispatch(sendPlanData(plan))
            setPlanDeleted(false);
        }
    }, [dispatch, plan, planDeleted])

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
                                    plan={plan}
                                    daily_plan={dailyPlan}
                                    rank={dailyPlan.rank}
                                    show_children={show_children}
                                    set_plan_deleted={setPlanDeleted}
                                />
                            }
                            return <div key={dailyPlan.id} />
                        })
                    }
                    <NewDailyPlan />
                </Container>
            </div>

            {/* Component for plans of today */}
            <div>
                <TodayPlans
                    today_plans={todayPlans}
                />
            </div>

            <TodayPlanSummary
                used_time_checked_today={plan.checked_tasks_today.used_time}
                expected_time_checked_today={plan.checked_tasks_today.expected_time}
                today_plans={todayPlans}
            />

            {/* Separation between TodayPlanSummary and TomorrowPlanSummary */}
            <div style={{height: "25px"}} />

            <TomorrowPlanSummary
                tomorrow_plans={tomorrowPlans}
            />

            {/* Separation between TomorrowPlanSummary and Focus */}
            <div style={{height: "25px"}} />

            <Focus />
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