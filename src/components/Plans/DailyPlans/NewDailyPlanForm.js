import React, { useRef } from 'react';

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
    
    const postPlanHandler = () => {
        // TODO
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


