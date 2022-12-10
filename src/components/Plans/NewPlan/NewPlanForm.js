/* ========== import React and React hooks ========== */
import React, { useRef } from 'react';

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
        }

        axios.post(`/plans.json`, target)
        .then(response => {
            const data = response.data;
            const child_id = data.name;

            // Update parent if current plan is a child plan
            updateParentPlan(child_id);
        })   
    }

    const updateParentPlan = (child_id) => {
        if (typeof props.parent !== 'undefined') {
            let parent_plan = props.parent_plan;
            if(!parent_plan.children) {
                console.log("Updating the database...");
                axios.put(`/plans/${props.parent}/children/${child_id}.json`, 1);
            } else {
                // Count the length of josn objects
                let keyCount  = Object.keys(parent_plan.children).length;
                console.log("Updating the database...");
                axios.put(`/plans/${props.parent}/children/${child_id}.json`, keyCount+1);
            }
        }  
    }
    
    return(
        <div className={classes.control}>
            <input type="text" ref={input_plan} />
            <button onClick={postPlanHandler}>Add</button>
            <button onClick={props.form_toggler}>Cancel</button>
        </div>
    )
}

export default NewPlanForm