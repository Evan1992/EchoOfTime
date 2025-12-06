/* ========== import React and React hooks ========== */
import { useRef } from 'react';
import { useDispatch } from 'react-redux';

/* ========== import other libraries ========== */
import { activePlanActions } from '../../../store/slices/active-plan-slice';

/* ========== import css ========== */
import classes from './NewLongTermPlan.module.css';

const NewLongTermPlan = (props) => {
    const dispatch = useDispatch();
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

    // Cancel edit when focus leaves the form (but not when focus moves between form controls)
    const onFormBlur = (event) => {
        const next = event.relatedTarget;
        // If focus is moving to an element outside the form (or nowhere), close the editor
        if (!event.currentTarget.contains(next)) {
            props.editPlanHandler(false);
        }
    }

    const onSubmit = (event) => {
        event.preventDefault();

        const dateToday = new Date().toLocaleDateString();
        const split = dateToday.split("/");
        const dateTodayISO = "".concat(split[2], "-", split[0], "-", split[1]);

        dispatch(
            activePlanActions.addPlan({
                title: inputTitle.current.value,
                description: inputDescription.current.value,
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
                    daily_plans: [],
                    todo_everyday: {
                        dateOfToday: dateTodayISO,
                        todo_everyday_plans: []
                    },
                }
            })
        )

        props.editPlanHandler(false);
    }

    return (
        <section className={classes.card}>
            <h1>Marathon</h1>
            <form onSubmit = {onSubmit} onBlur={onFormBlur}>
                <div className={classes.input_form}>
                    <input className={classes.input_title}
                        type = "text"
                        required
                        placeholder = "Title"
                        aria-label = "Title"
                        ref = {inputTitle}
                        defaultValue = {props.inputTitle}
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
                        defaultValue = {props.inputDescription}
                        onFocus={onFocus}
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