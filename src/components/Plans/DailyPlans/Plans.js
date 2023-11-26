import React, { useState, useEffect, useCallback, useContext } from 'react';

/* ========== import React components ========== */
import Plan from './Plan';
import NewPlan from '../NewPlan/NewPlan';
import TodayPlans from '../TodayPlans/TodayPlans';
import { PlansOfTodayContextProvider } from '../../../store/plans-of-today-context';
import TodayPlanSummary from '../TodayPlans/TodayPlanSummary';
import TomorrowPlanSummary from '../TomorrowPlans/TomorrowPlanSummary';
import AuthContext from '../../../store/auth-context';

/* ========== import other libraries ========== */
import { isToday } from '../../../utilities';
import Container from 'react-bootstrap/Container';

/* ========== import css ========== */
import 'bootstrap/dist/css/bootstrap.min.css';
import classes from './Plans.module.css';

const Plans = (props) => {
    // plans is map, key is the plan_id, value is the plan object
    const [plans, setPlans] = useState(new Map());
    // ordered_plans is a 2D array, each element is [plan_id, plan]
    const [ordered_plans, setOrderedPlans] = useState([]);
    const [today_plans, setTodayPlans] = useState([]);
    // totalPlannedTimeToday is: Time for active plans of today + Time for finished plans of today
    const [totalPlannedTimeToday, setTotalPlannedTimeToday] = useState(0);
    const [usedTimeToday, setUsedTimeToday] = useState(0);
    const [exist_today_plans, setExistTodayPlans] = useState(true);
    const [isFetch, setIsFetch] = useState(false);

    // Object for interacting with database endpoint
    const authCtx = useContext(AuthContext);
    const instance = authCtx.firebase;

    // get data from database
    const fetchPlansHandler = useCallback(async () => {
        let _plans = new Map();
        if(!isFetch){
            const response = await instance.get(`/long_term_plans/active_plans/${props.long_term_plan_id}/short_term_plans/active_plans/${props.short_term_plan_id}/daily_plans/active_plans.json`);
            const data = response.data;
            for (let index in data) {
                _plans.set(index, data[index]);
            }

            setIsFetch(true);

            // Set plans all in one time
            setPlans(plans => _plans);
        }
    }, [isFetch, props.long_term_plan_id, props.short_term_plan_id, instance])

    const setOrderedPlansHandler = (plan, ordered_plans) => {
        if("children" in plan) {
            for(const child_id in plan.children) {
                ordered_plans = [...ordered_plans, [child_id, plans.get(child_id)]];
                ordered_plans = setOrderedPlansHandler(plans.get(child_id), ordered_plans);
            }
        }
        return ordered_plans;
    }

    const setTodayPlansHandler = (all_plans) => {
        // Push plans of today to a list as well as update the
        const _today_plans = []
        let plans_of_today_expected_seconds_remote = 0;
        let plans_of_today_used_seconds_remote = 0;
        all_plans.forEach((plan) => {
            const is_today = isToday(plan.date)
            if(is_today) {
                _today_plans.push(plan)
                plans_of_today_expected_seconds_remote += plan.expected_hours * 3600 + plan.expected_minutes * 60;
                plans_of_today_used_seconds_remote += plan.seconds;
            }
        })

        if(_today_plans.length === 0) {
            setExistTodayPlans(false)
        }
        setTodayPlans(today_plans => _today_plans)

        // set totalPlannedTimeToday so the Total Planned Time can be shown at the component TodayPlanSummary
        let plans_of_today_expected_seconds_local = 0;
        if(localStorage.getItem('plannedTimeToday') !== null) {
            // localStorage.getItem() will return either String or null
            plans_of_today_expected_seconds_local = Number(localStorage.getItem('plannedTimeToday'));
        }
        setTotalPlannedTimeToday(plans_of_today_expected_seconds_local + plans_of_today_expected_seconds_remote);

        // set UsedTimeToday so the Total Used Time can be shown at the component TodayPlanSummary
        let plans_of_today_used_seconds_local = 0;
        if(localStorage.getItem('usedTimeToday') !== null) {
            plans_of_today_used_seconds_local = Number(localStorage.getItem('usedTimeToday'));
        }
        setUsedTimeToday(plans_of_today_used_seconds_local + plans_of_today_used_seconds_remote);
    }

    // this function get called when hiding all the children plans
    const getToChangePlanIds = (plan_id, to_change_plan_ids) => {
        const cur_plan = plans.get(plan_id);
        if("children" in cur_plan) {
            for(const child_id in cur_plan.children) {
                // If child plan is not shown, stop adding the child id the to_change_plan_ids list
                if(plans.get(child_id).show_plan) {
                    to_change_plan_ids = [...to_change_plan_ids, child_id];
                    to_change_plan_ids = getToChangePlanIds(child_id, to_change_plan_ids)
                }
            }
        }
        return to_change_plan_ids;
    }

    // show/hide children plans of current plan
    const childrenToggleHandler = (event, cur_plan_id) => {
        // shadow copy of "plans"
        let new_plans = new Map(plans);
        let to_change_plan_ids = []

        const cur_plan = plans.get(cur_plan_id);
        const cur_plan_child_id = Object.keys(cur_plan.children)[0];
        const cur_plan_child_plan = plans.get(cur_plan_child_id);

        // if hiding children plans, hide all children plans under current plan
        if(cur_plan_child_plan.show_plan) {
            to_change_plan_ids = getToChangePlanIds(cur_plan_id, []);
        } else {
            for(const child_id in cur_plan.children) {
                to_change_plan_ids.push(child_id);
            }
        }
        
        to_change_plan_ids.forEach(plan_id => {
            let new_plan = new_plans.get(plan_id);
            new_plan.show_plan = !new_plan.show_plan;
            // Update the map
            new_plans.set(plan_id, new_plan);
        })

        setPlans(plans => new_plans);
    }

    // get the data from database as soon as user visit the home page
    useEffect(() => {
        fetchPlansHandler();
    }, [fetchPlansHandler]);

    // After fetching the data, set ordered_plans
    if(plans.size !== 0) {
        if(ordered_plans.length === 0) {
            let _ordered_plans = [];
            plans.forEach((value, key) => {
                if(value.rank === 0) {
                    _ordered_plans = [..._ordered_plans, [key, value]]
                    _ordered_plans = setOrderedPlansHandler(value, _ordered_plans);
                }
            })
            setOrderedPlans(ordered_plans => _ordered_plans);
        }
    }

    // set today_plans and pass it to PlansOfTodayContextProvider
    // All these if conditions are used to prevent infinite react render
    if(plans.size !== 0) {
        if(today_plans.length === 0 && exist_today_plans ) {
            setTodayPlansHandler(plans)
        }
    }

    return (
        <React.Fragment>
            {/* Component for all active plans */}
            <div className={classes.plans}>
                <Container fluid className={classes.container}>
                    {
                        ordered_plans.map((element) => {
                            if(element[1].show_plan) {
                                let show_children = false;
                                if("children" in element[1]) {
                                    show_children = plans.get(Object.keys(element[1].children)[0]).show_plan;
                                }
                                return <PlansOfTodayContextProvider key={element[0]} today_plans={today_plans}>
                                            <Plan
                                                long_term_plan_id={props.long_term_plan_id}
                                                short_term_plan_id={props.short_term_plan_id}
                                                all_plans={plans}
                                                plan_id={element[0]}
                                                plan={element[1]}
                                                show_children={show_children}
                                                childrenToggleHandler={event => childrenToggleHandler(event, element[0])}
                                            />
                                        </PlansOfTodayContextProvider>
                            }
                            return <div key={element[0]} />
                        })
                    }
                    <NewPlan
                        long_term_plan_id={props.long_term_plan_id}
                        short_term_plan_id={props.short_term_plan_id}
                    />
                </Container>
            </div>

            {/* Component for plans of today */}
            <div>
                <TodayPlans 
                    today_plans={today_plans} 
                />
            </div>

            {/* Separation between TodayPlans and TodayPlanSummary*/}
            <div style={{height: "25px"}} /> 

            <TodayPlanSummary
                all_plans = {plans}
                total_planned_time = {totalPlannedTimeToday}
                used_time = {usedTimeToday}
            />

            {/* Separation between TodayPlanSummary and TomorrowPlanSummary*/}
            <div style={{height: "25px"}} />

            <TomorrowPlanSummary
                all_plans = {plans}
            />
        </React.Fragment>
    )
}

export default Plans


/* ========== Learning ========== */
/* UseEffect */
// The Effect Hook lets you perform side effects in function components.
// In this component, the hook helps request the data from database

/* useCallback */
// We can sepcify the dependency of the function called in useEffect, here, the dependency is the
// function itself. The function as an object, will change, and it results in infinite loop. We
// wrap the function in the useCallback hook to prevent infinite loop.

/* Pass function with parameters to child component */
// pass the function like the below will call the function directly
// childrenToggleHandler={childrenToggleHandler(element)}

/* Javascript loop through an object vs Javascript loop through an array */
// Loop through an object: for(const property in object)
// Loop through an array:  for(const element in array)

/* Number of render of this page */
// Number of render of this page depends on how many times we setState
// Each time when a new state is set, the page will be re-rendered


/* ========== Design ========== */
/* How to handle the data store for active plans of today and completed plans of today */
// For active plans of today, get the info, specifically, the expected completion time from database
// For completed plans of today, get the expected completion time from localStorage. Each time
// when we check a plan, we store the expected time of that plan locally.