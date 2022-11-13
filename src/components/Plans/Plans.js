import React, { useState, useEffect, useCallback } from 'react';

/* ========== import React components ========== */
import Plan from './Plan'
import NewPlan from './NewPlan/NewPlan'

/* ========== import other libraries ========== */
import axios from 'axios';
import Container from 'react-bootstrap/Container';


/* ========== import css ========== */
import 'bootstrap/dist/css/bootstrap.min.css';
import classes from './Plans.module.css';

const Plans = () => {
    const [plan_ids, setPlanIds] = useState([]);
    const [plans, setPlans] = useState([]);
    const [ordered_plans, setOrderedPlans] = useState([]);
    const [isFetch, setIsFetch] = useState(false);

    const setOrderedPlansHandler = (plan, index, ordered_plans) => {
        if(plan !== null) {
            if(!("children" in plan)) {
                return ordered_plans;
            } else {
                for(const child_id in plan.children) {
                    for(let i = 0; i < plan_ids.length; i++) {
                        if(plan_ids[i] === child_id) {
                            ordered_plans = [...ordered_plans, plans[i]];
                            ordered_plans = setOrderedPlansHandler(plans[i], i+1, ordered_plans);
                        }
                    }
                }
            }
        } else {
            for(let i = index; i < plans.length; i++) {
                if(plans[i].rank === 0) {
                    ordered_plans = [...ordered_plans, plans[i]];
                    ordered_plans = setOrderedPlansHandler(plans[i], i+1, ordered_plans);
                }
            }
        }
        return ordered_plans;
    }

    // get data from database
    const fetchPlansHandler = useCallback(async () => {
        let _plans = [];
        let _plan_ids = [];
        if(!isFetch){
            const response = await axios.get('https://sound-of-time-2-default-rtdb.firebaseio.com/plans.json');
            const data = response.data;
            for (let index in data) {
                _plans.push(data[index]);
                _plan_ids.push(index);
            }

            setIsFetch(true);

            // Set plans and plan_ids for one time
            setPlanIds(plan_ids => _plan_ids);
            setPlans(plans => _plans);
        }
    }, [isFetch])

    const getChildrenIndexes = (cur_plan_id, cur_plan, return_list) => {
        if(!("children" in cur_plan)) {
            return;
        } else {
            for(const child_id in cur_plan.children) {
                for(let i = 0; i < plan_ids.length; i++) {
                    if(plan_ids[i] === child_id) {
                        return_list.push(i);
                        getChildrenIndexes(child_id, plans[i], return_list);
                    }
                }
            }
        }
        return return_list;
    }

    // show/hide children plans of current plan
    const childrenToggleHandler = (event, cur_plan) => {
        // shadow copy of "plans"
        let new_plans = [...plans];
        let to_change_index = [];
        let isShow = false;

        // loop through an object
        for(const child_id in cur_plan.children) {
            for(let i = 0; i < plan_ids.length; i++) {
                if(plan_ids[i] === child_id) {
                    // if hiding children plans, hide all children plans under current plan
                    if(new_plans[i].show_plan) {
                        isShow = true;
                        to_change_index.push(i);
                        // call this function to get the indexes of all children plans
                        const children_indexes = getChildrenIndexes(child_id, new_plans[i], []);                        
                        if(typeof children_indexes !== 'undefined'){
                            to_change_index = to_change_index.concat(children_indexes);
                        }
                    } else {
                        to_change_index.push(i);
                    }
                }
            }
        }

        // loop through an array
        for(const i of to_change_index) {
            new_plans[i].show_plan = !isShow;
        }
        
        setPlans(plans => new_plans);
    }

    // get the data from database as soon as user visit the home page
    useEffect(() => {
        fetchPlansHandler();
    }, [fetchPlansHandler]);

    // After fetching the data, set ordered_plans
    if(plans.length !== 0) {
        if(ordered_plans.length === 0) {
            let _ordered_plans = [];
            _ordered_plans = setOrderedPlansHandler(null, 0, []);
            setOrderedPlans(ordered_plans => _ordered_plans);
        }

    }

    return (
        <div className={classes.plans}>
            <Container fluid className={classes.container}>
                {
                    ordered_plans.map((element, index) => {
                        if(element.show_plan)
                            return <Plan key={plan_ids[index]} plan={element} plan_id={plan_ids[index]} plan_title={element.title} plan_rank={element.rank} childrenToggleHandler={event => childrenToggleHandler(event, element)} />
                        return <div key={plan_ids[index]} />
                    })
                }
                <NewPlan />
            </Container>
        </div>
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
// wrap the function in the useCallback hook

/* Pass function with parameters to child component */
// pass the function like the below will call the function directly
// childrenToggleHandler={childrenToggleHandler(element)}

/* Javascript loop through an object vs Javascript loop through an array */
// Loop through an object: for(const property in object)
// Loop through an array:  for(const element in array)

/* Number of render of this page */
// Number of render of this page depends on how many times we setState
// Each time when a new state is set, the page will be re-rendered