import React, { useState, useRef } from 'react';

/* ========== import react components ========== */
// import Backdrop from './Backdrop';
// import axios from '../../axios';

/* ========== import css ========== */
import classes from './InlineEdit.module.css';

const InlineEdit = (props) => {
    const [inputTitle, setInputTitle] = useState(props.inputTitle);
    const [inputDescription, setInputDescription] = useState(props.inputDescription);
    let newInputTitle = useRef(props.inputTitle);
    let newInputDescription = useRef(props.inputDescription);

    const titleChangeHandler = (event) => {
        setInputTitle(inputTitle => event.target.value);
    }

    const descriptionChangeHandler = (event) => {
        setInputDescription(inputDescription => event.target.value);
    }

    const onBlur = () => {
        props.postPlan(inputTitle, inputDescription);
    }

    const onKeyDown = (event) => {
        if (event.key === "Enter" || event.key === "Escape") {
            event.target.blur();
        }
    }

    return (
        <React.Fragment >
            <div className={classes.inline_edit}>
                <input
                    type = "text"
                    aria-label = "Title"
                    ref = {newInputTitle}
                    value = {inputTitle}
                    onChange = {titleChangeHandler}
                    onBlur={onBlur}
                    onKeyDown={onKeyDown}
                />
                <input 
                    type = "text"
                    aria-label = "Description"
                    ref = {newInputDescription}
                    value = {inputDescription}
                    onChange = {descriptionChangeHandler}
                    onBlur={onBlur}
                    onKeyDown={onKeyDown}
                />                
            </div>
        </React.Fragment>
    )
}

export default InlineEdit

/* ========== Learning ========== */
/* aria-label */
// The aria-label attribute defines a string value that labels an interactive element
