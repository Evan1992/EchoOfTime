/* ========== import React and React hooks ========== */
import React, { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/* ========== import React components ========== */
import NewDailyPlan from './NewDailyPlan';
import DailyPlan from './DailyPlan';
import TodayPlans from '../TodayPlans/TodayPlans';
import TodayPlanSummary from '../TodayPlans/TodayPlanSummary';
import Focus from '../../Focus/Focus';
import AuthContext from '../../../store/auth-context';

/* ========== import other libraries ========== */
import Container from 'react-bootstrap/Container';
import { isTomorrow } from '../../../utilities';
import { sendPlanData } from '../../../store/slices/active-plan-actions';

/* ========== import css ========== */
import 'bootstrap/dist/css/bootstrap.min.css';
import classes from './DailyPlans.module.css';
import TomorrowPlanSummary from '../TomorrowPlans/TomorrowPlanSummary';


const DailyPlans = () => {
    const authCtx = useContext(AuthContext);
    const [planDeleted, setPlanDeleted] = useState(false);
    // Only one timer for a task can be active at a time
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [timerHolder, setTimerHolder] = useState(null);
    const [highlight, setHighlight] = useState(null);
    const dispatch = useDispatch();
    const plan = useSelector((state) => state.activePlan);

    const tomorrowPlans = []
    if(plan.short_term_plan.daily_plans !== undefined) {
        for(const daily_plan of plan.short_term_plan.daily_plans) {
            if(isTomorrow(daily_plan.date)) {
                tomorrowPlans.push(daily_plan)
            }
        }
    }

    useEffect(() => {
        if(planDeleted === true) {
            // No need to do sendDailyPlanData as sendPlanData will update the parent object
            // dispatch(sendDailyPlanData(authCtx.userID, plan))
            dispatch(sendPlanData(authCtx.userID, authCtx.token, plan))
            setPlanDeleted(false);
        }
    }, [dispatch, authCtx.userID, authCtx.token, plan, planDeleted])

    return (
        <React.Fragment>
            {/* Component for all active plans */}
            <div className={classes.plans}>
                <Container>
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
                                    id={dailyPlan.id}
                                    plan={plan}
                                    daily_plan={dailyPlan}
                                    rank={dailyPlan.rank}
                                    show_children={show_children}
                                    set_plan_deleted={setPlanDeleted}
                                    isTimerActive={isTimerActive}
                                    setIsTimerActive={setIsTimerActive}
                                    timerHolder={timerHolder}
                                    setTimerHolder={setTimerHolder}
                                    highlight={highlight}
                                    setHighlight={setHighlight}
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
                    today_plans={plan.today.today_plans}
                />
            </div>

            <TodayPlanSummary
                today_plans={plan.today.today_plans}
                used_time={plan.today.used_time}
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

/* Pass function with parameters to child component */
// pass the function like the below will call the function directly
// childrenToggleHandler={childrenToggleHandler(element)}

/* Javascript loop through an object vs Javascript loop through an array */
// Loop through an object: for(const property in object)
// Loop through an array:  for(const element in array)

/* Number of render of this page */
// Number of render of this page depends on how many times we setState
// Each time when a new state is set, the page will be re-rendered

/* CSS style: fluid */
// <Container fluid /> means the width is always 100% across all viewport and
// device sizes.
// <Container fluid="md"> sets the Container as fluid until the specified
// breakpoint