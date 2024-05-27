import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';

/* ========== import other libraries ========== */
import { activePlanActions } from '../../../store/slices/active-plan-slice';

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
    
    const postPlanHandler = () => {
        const newDailyPlan = {
            title: inputPlan.current.value,
            comment: "",
            date: null,
            seconds: 0,
            expected_hours: 0,
            expected_minutes: 0
        }
        dispatch(
            activePlanActions.addDailyPlan({
                daily_plan:newDailyPlan
            })
        );
    }

    return (
        <React.Fragment>
            {/* Form for the new daily plan */}
            <Backdrop onClick={props.formToggler} />
            <div className={classes.control}>
                <input type="text" ref={inputPlan} />
                <button onClick={postPlanHandler}>Add</button>
                <button onClick={props.formToggler}>Cancel</button>
            </div>
        </React.Fragment>
    )
}

export default NewDailyPlanForm;


