import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';

/* ========== import other libraries ========== */
import { activePlanActions } from '../../../store/slices/active-plan-slice';
import { backlogPlanActions } from '../../../store/slices/backlog-plan-slice';

/* ========== import react components ========== */
import Backdrop from '../../UI/Backdrop';

/* ========== import css ========== */
import classes from './NewDailyPlanForm.module.css';

const NewDailyPlanForm = (props) => {
    /**
     * @note
     * useRef() hook will help avoid the redundant calls to setState() 
     * and re-render the page for every keystroke
     */
    let inputPlan = useRef();
    const dispatch = useDispatch();

    const addPlanHandler = () => {
        const newDailyPlan = {
            id: crypto.randomUUID(),
            rank: props.rank,
            title: inputPlan.current.value,
            comment: "",
            date: props.date || "",
            seconds: 0,
            expected_hours: 0,
            expected_minutes: 0,
            priority: 0,
            parent_id: props.parent_id, // props.parent_id could be undefined if the new plan is the root daily plan
            has_children: false,
            show_plan: true,
            completed: false
        }

        if (props.isBacklog) {
            dispatch(
                backlogPlanActions.addDailyPlan({
                    daily_plan: newDailyPlan,
                    parent_id: props.parent_id
                })
            );
        } else if (props.isTodoEverydayPlan) {
            dispatch(
                activePlanActions.addDailyPlanForTodoEveryPlan({
                    daily_plan: newDailyPlan,
                    parent_id: props.parent_id
                })
            );
        } else {
            dispatch(
                activePlanActions.addDailyPlan({
                    daily_plan: newDailyPlan,
                    parent_id: props.parent_id
                })
            );
        }

        props.setIsAddNewPlan(true);
        props.formToggler();   // Hide the form after add a new plan
    }

    return (
        <React.Fragment>
            {/* Form for the new daily plan */}
            <Backdrop onClick={props.formToggler} />
            <div className={classes.control}>
                <input type="text" ref={inputPlan} />
                <button onClick={addPlanHandler}>Add</button>
                <button onClick={props.formToggler}>Cancel</button>
            </div>
        </React.Fragment>
    )
}

export default NewDailyPlanForm;


