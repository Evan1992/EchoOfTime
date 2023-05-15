import React, { useRef } from 'react';

/* ========== import react components ========== */
import Backdrop from '../../UI/Backdrop';

/* ========== import other libraries ========== */
import axios from '../../../axios'

/* ========== import css ========== */
import classes from './NewPlanForm.module.css'

const NewPlanForm = (props) => {
    /**
     * @note
     * useRef() hook will help avoid the redundant calls to setState() 
     * and re-render the page for every keystroke
     */
    let input_plan = useRef();

    const postPlanHandler = () => {
        const target = {
            show_plan: props.show_plan? props.show_plan:false,
            complete: false,
            active: true,
            title: input_plan.current.value,
            comment: "",
            rank: props.rank? props.rank:0,
            parent: props.parent? props.parent:"",
            children: {},
            date: "",
            seconds: 0,
            expected_hours: 0,
            expected_minutes: 0
        }

        axios.post(`/long_term_plans/active_plans/${props.long_term_plan_id}/short_term_plans/active_plans/${props.short_term_plan_id}/daily_plans/active_plans.json`, target)
        .then(response => {
            const data = response.data;
            const child_id = data.name;

            // Update parent if current plan is a child plan
            updateParentPlan(child_id)
        });
    }

    const updateParentPlan = (child_id) => {
        if (typeof props.parent !== 'undefined') {
            let parent_plan = props.parent_plan;
            if(!parent_plan.children) {
                console.log("Updating the database...");
                axios.put(`/long_term_plans/active_plans/${props.long_term_plan_id}/short_term_plans/active_plans/${props.short_term_plan_id}/daily_plans/active_plans/${props.parent}/children/${child_id}.json`, 1)
                .then(() => {
                    refreshPage();
                })
            } else {
                // Count the length of json objects
                let keyCount  = Object.keys(parent_plan.children).length;
                console.log("Updating the database...");
                // axios.put(`/plans/${props.parent}/children/${child_id}.json`, keyCount+1)
                axios.put(`/long_term_plans/active_plans/${props.long_term_plan_id}/short_term_plans/active_plans/${props.short_term_plan_id}/daily_plans/active_plans/${props.parent}/children/${child_id}.json`, keyCount+1)
                .then(() => {
                    refreshPage();
                })
            }
        } else {
            refreshPage();
        }
    }

    const refreshPage = () => {
        window.location.reload();
    }
    
    return(
        <React.Fragment>
            <Backdrop onClick={props.form_toggler} />
            <div className={classes.control}>
                <input type="text" ref={input_plan} />
                <button onClick={postPlanHandler}>Add</button>
                <button onClick={props.form_toggler}>Cancel</button>
            </div>
        </React.Fragment>
    )
}

export default NewPlanForm