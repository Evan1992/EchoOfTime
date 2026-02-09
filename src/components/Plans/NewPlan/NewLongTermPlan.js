/* ========== import React and React hooks ========== */
import { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/* ========== import other libraries ========== */
import { activePlanActions } from '../../../store/slices/active-plan-slice';

/* ========== import css ========== */
import classes from './NewLongTermPlan.module.css';

const NewLongTermPlan = (props) => {
    const dispatch = useDispatch();
    let inputTitle = useRef(props.inputTitle);
    let inputDescription = useRef(props.inputDescription);
    let formRef = useRef();
    const plan = useSelector((state) => state.activePlan);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (formRef.current && !formRef.current.contains(event.target)) {
                props.editPlanHandler(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [props.editPlanHandler]);

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

        const new_short_term_plan = {
            title: "",
            description: "",
            date: null,
            daily_plans: [],
            todo_everyday: {
                dateOfToday: dateTodayISO,
                todo_everyday_plans: []
            },
        };
        const short_term_plan = (plan.short_term_plan !== undefined) ? plan.short_term_plan : new_short_term_plan;

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
                short_term_plan
            })
        )

        props.editPlanHandler(false);
    }

    return (
        <section className={classes.card}>
            <h1>Marathon</h1>
            <form onSubmit = {onSubmit} ref={formRef}>
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