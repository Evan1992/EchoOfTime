/* ========== import React and React hooks ========== */
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

/* ========== import other libraries ========== */
import { activePlanActions } from '../../../store/slices/active-plan-slice';

/* ========== import css ========== */
import classes from './NewLongTermPlan.module.css';

const NewLongTermPlan = (props) => {
    const dispatch = useDispatch();
    const [inputTitle, setInputTitle] = useState(props.inputTitle);
    const [inputDescription, setInputDescription] = useState(props.inputDescription);

    const titleChangeHandler = (event) => {
        setInputTitle(inputTitle => event.target.value);
    }

    const descriptionChangeHandler = (event) => {
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

        const dateToday = new Date().toLocaleDateString();
        const split = dateToday.split("/");
        const dateTodayISO = "".concat(split[2], "-", split[0], "-", split[1]);

        dispatch(
            activePlanActions.addPlan({
                title: inputTitle,
                description: inputDescription,
                date: dateTodayISO,
                changed: true,
                today: {
                    date: dateTodayISO,
                    today_plans: [],
                    used_time: 0
                },
                short_term_plan: {
                    title: "",
                    description: "",
                    date: null,
                    daily_plans: []
                }
            })
        )

        props.editPlanHandler();
    }

    return (
        <section className={classes.card}>
            <h1>Marathon</h1>
            <form onSubmit = {onSubmit}>
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
        </section>
    )
}

export default NewLongTermPlan


/* ========== Learning ========== */
/* html tag textarea */
// Reference: https://www.w3schools.com/tags/tag_textarea.asp