/* ========== import React and React hooks ========== */
import React, { useRef } from 'react';

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
        // const target = {
        //     complete: false,
        //     active: true,
        //     title: input_plan.current.value,
        //     comment: "",
        //     rank: props.rank? props.rank:0,
        //     parent: props.parent? props.parent:"",
        //     children: {},
        //     date: "",
        //     seconds: 0,
        // }
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