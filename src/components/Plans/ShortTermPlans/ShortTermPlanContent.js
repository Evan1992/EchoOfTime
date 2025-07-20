import React, { useRef } from 'react';
import ReactMarkdown from 'react-markdown';

/* ========== import css ========== */
import classes from './ShortTermPlanContent.module.css';

const ShortTermPlanContent = (props) => {
    let inputTitle = useRef(props.inputTitle);
    let inputDescription = useRef(props.inputDescription);

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
        props.postPlan(inputTitle.current.value, inputDescription.current.value);
    }

    return (
        <React.Fragment >
            {props.inputTitle.trim() === "" || props.isEditing === true ? (
                <form onSubmit={onSubmit}>
                    <div className={classes.input_form}>
                        <input className={classes.input_title}
                            type = "text"
                            required
                            placeholder = "Title"
                            aria-label = "Title"
                            ref = {inputTitle}
                            onFocus={onFocus}
                            onKeyDown={onKeyDown}
                        />
                    </div>
                    <div className={classes.input_form}>
                        <textarea className={classes.input_description}
                            type = "text"
                            required
                            placeholder = "Details (Markdown supported)"
                            aria-label = "Description"
                            ref = {inputDescription}
                            onFocus={onFocus}
                            onInput = {onInput}
                        />
                    </div>
                    <div className={classes.submit_button}>
                        <button>Submit</button>
                    </div>
                </form>
            ) : (
                <React.Fragment>
                    <h5>{props.inputTitle}</h5>
                    <ReactMarkdown>{props.inputDescription}</ReactMarkdown>
                </React.Fragment>
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
