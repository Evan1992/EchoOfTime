import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/* ========== import other libraries ========== */
import { activePlanActions } from '../../../store/slices/active-plan-slice';
import { sendDailyPlanData } from '../../../store/slices/active-plan-actions';

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
    const [isAddNewPlan, setIsAddNewPlan] = useState(false);
    const plan = useSelector((state) => state.activePlan);
    const dispatch = useDispatch();

    useEffect(() => {
        if(isAddNewPlan) {
            dispatch(sendDailyPlanData(plan));
            setIsAddNewPlan(false);
        }
    }, [dispatch, plan, isAddNewPlan])

    const addPlanHandler = () => {
        const newDailyPlan = {
            title: inputPlan.current.value,
            comment: "",
            date: new Date().toISOString().slice(0,10),
            seconds: 0,
            expected_hours: 0,
            expected_minutes: 0,
            parent_id: props.parent_id, // props.parent_id could be undefined if the new plan is the root daily plan
            show_children: false
        }
        dispatch(
            activePlanActions.addDailyPlan({
                daily_plan:newDailyPlan
            })
        );
        setIsAddNewPlan(true);
        // Empty the input box after submission
        inputPlan.current.value = "";
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


