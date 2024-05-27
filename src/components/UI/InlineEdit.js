import React, { useState, useEffect } from 'react';

/* ========== import react components ========== */
// import Backdrop from './Backdrop';

/* ========== import css ========== */
import classes from './InlineEdit.module.css';

const InlineEdit = (props) => {
    const [initialLoading, setInitialLoading] = useState(true);
    const [inputTitle, setInputTitle] = useState(props.inputTitle);
    const [inputDescription, setInputDescription] = useState(props.inputDescription);
    const [inputDescriptionHeight, setInputDescriptionHeight] = useState(props.inputDescriptionHeight)

    useEffect(() => {
        if(initialLoading === false) {
            setInputTitle(props.inputTitle);
            setInputDescription(props.inputDescription);
        } else {
            setInitialLoading(false);
        }
    }, [props, initialLoading])

    const titleChangeHandler = (event) => {
        setInputTitle(inputTitle => event.target.value);
    }

    const descriptionChangeHandler = (event) => {
        // Update the description height
        setInputDescriptionHeight(inputDescriptionHeight => event.target.style.height)

        // Update the description
        setInputDescription(inputDescription => event.target.value);
    }

    const onInput = (event) => {
        if (event.target.scrollHeight > 100) {
            event.target.style.height = (event.target.scrollHeight - 16) + "px";
        }
    }

    const onBlur = () => {
        props.postPlan(inputTitle, inputDescription);
    }

    const onKeyDown = (event) => {
        if (event.key === "Enter" || event.key === "Escape") {
            event.target.blur();
        }
    }

    const inlineStyle = {
        height: `${inputDescriptionHeight}`
    }

    return (
        <React.Fragment >
            <div className={classes.inline_edit}>
                <input className={classes.input_title}
                    type = "text"
                    aria-label = "Title"
                    // ref = {newInputTitle}
                    value = {inputTitle}
                    onChange = {titleChangeHandler}
                    onBlur={onBlur}
                    onKeyDown={onKeyDown}
                />
            </div>
            <div className={classes.inline_edit}>
                <textarea className={classes.input_description}
                    type = "text"
                    style = {inlineStyle}
                    aria-label = "Description"
                    // ref = {newInputDescription}
                    value = {inputDescription}
                    onChange = {descriptionChangeHandler}
                    onInput = {onInput}
                    onBlur = {onBlur}
                />                
            </div>
        </React.Fragment>
    )
}

export default InlineEdit

/* ========== Learning ========== */
/* aria-label */
// The aria-label attribute defines a string value that labels an interactive element

/* useState() will only be called once */
// React saves the initial state once and ignores it on the next renders.
// As a result, for `const [inputTitle, setInputTitle] = useState(props.inputTitle);`,
// inputTitle won't be reseted even though `props.inputTitle` changes
