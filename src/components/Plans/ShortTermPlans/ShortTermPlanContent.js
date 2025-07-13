import React, { useState, useEffect } from 'react';

/* ========== import react components ========== */
// import Backdrop from './Backdrop';

/* ========== import css ========== */
import classes from './ShortTermPlanContent.module.css';

const ShortTermPlanContent = (props) => {
    const [initialLoading, setInitialLoading] = useState(true);
    const [inputTitle, setInputTitle] = useState(props.inputTitle);
    const [inputDescription, setInputDescription] = useState(props.inputDescription);

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
        // Update the description
        setInputDescription(inputDescription => event.target.value);
    }

    const onFocus = (event) => {
        event.target.style.height = event.target.scrollHeight + "px";
    }

    const onInput = (event) => {
        if (event.target.scrollHeight > 100) {
            event.target.style.height = (event.target.scrollHeight - 16) + "px";
        }
    }

    const onKeyDown = (event) => {
        if (event.key === "Enter" || event.key === "Escape") {
            event.target.blur();
        }
    }

    const onSubmit = (event) => {
        event.preventDefault();
        props.postPlan(inputTitle, inputDescription);
    }

    return (
        <React.Fragment >
            {props.inputTitle.trim() === "" ? (
                <form onSubmit={onSubmit}>
                    <div className={classes.input_form}>
                        <input className={classes.input_title}
                            type = "text"
                            required
                            placeholder = "Title"
                            aria-label = "Title"
                            value = {inputTitle}
                            onFocus={onFocus}
                            onChange = {titleChangeHandler}
                            onKeyDown={onKeyDown}
                        />
                    </div>
                    <div className={classes.input_form}>
                        <textarea className={classes.input_description}
                            type = "text"
                            required
                            placeholder = "Details (Markdown supported)"
                            aria-label = "Description"
                            value = {inputDescription}
                            onFocus={onFocus}
                            onChange = {descriptionChangeHandler}
                            onInput = {onInput}
                        />
                    </div>
                    <div className={classes.submit_button}>
                        <button>Submit</button>
                    </div>
                </form>
            ) : (
                <div>Existing Sprint</div>
            )}
        </React.Fragment>
    )
}

export default ShortTermPlanContent

/* ========== Learning ========== */
/* aria-label */
// The aria-label attribute defines a string value that labels an interactive element

/* useState() will only be called once */
// React saves the initial state once and ignores it on the next renders.
// As a result, for `const [inputTitle, setInputTitle] = useState(props.inputTitle);`,
// inputTitle won't be reseted even though `props.inputTitle` changes

/* event.preventDefault() */
// A preventDefault is called on the event when submitting the form to prevent
// a browser reload/refresh. Otherwise, the browser will reload the page and lose the state
// and the data will not be sent to the server.
