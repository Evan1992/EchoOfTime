import React, { useState } from 'react';

/* ========== import react components ========== */
import axios from '../../../axios';
import NewPlanForm from '../NewPlan/NewPlanForm'
import Timer from '../../Timer/Timer';
import Backdrop from '../../UI/Backdrop';

/* ========== import other libraries ========== */
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Calendar from 'react-calendar';

/* ========== import css ========== */
import classes from './Plan.module.css'

const Plan = (props) => {
    const [showForm, setShowForm] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [isClockActive, setIsClockActive] = useState(false);
    const [seconds, setSeconds] = useState(props.plan.seconds);
    const [secondsBeforeStart, setSecondsBeforeStart] = useState(props.plan.seconds);
    const [_date, setDate] = useState(props.plan.date.val);
    const [planDeleted, setPlanDeleted] = useState(false);
    const [parentPlanUpdated, setParentPlanUpdated] = useState(false);

    const formToggleHandler = () => {
        setShowForm(showForm => !showForm);
    }

    const calendarToggleHandler = () => {
        setShowCalendar(showCalendar => !showCalendar)
    }

    const getAllParentPlans = (cur_plan, parent_plans_ids_seconds) => {
        if(cur_plan.parent !== "") {
            let parent_plan = props.all_plans.get(cur_plan.parent);
            parent_plans_ids_seconds = [...parent_plans_ids_seconds, [cur_plan.parent, parent_plan.seconds]];
            parent_plans_ids_seconds = getAllParentPlans(parent_plan, parent_plans_ids_seconds);
        }
        return parent_plans_ids_seconds;
    }

    const clockToggleHandler = () => {
        // Upload the latest time to database after stopping the timer
        // Update both current plan and its parent plans
        if(isClockActive) {
            // Update current plan
            console.log("Updating the database...");
            axios.put(`long_term_plans/active_plans/${props.long_term_plan_id}/short_term_plans/active_plans/${props.short_term_plan_id}/daily_plans/active_plans/${props.plan_id}/seconds.json`, seconds);

            // Update parent plans
            const addedSeconds = seconds - secondsBeforeStart;
            setSecondsBeforeStart(secondsBeforeStart => seconds);

            let parent_plans_ids_seconds = []
            parent_plans_ids_seconds = getAllParentPlans(props.plan, parent_plans_ids_seconds)

            for(let i = 0; i < parent_plans_ids_seconds.length; i++) {
                let plan_id = parent_plans_ids_seconds[i][0];
                let seconds = parent_plans_ids_seconds[i][1];
                console.log("Updating the database...");
                axios.put(`long_term_plans/active_plans/${props.long_term_plan_id}/short_term_plans/active_plans/${props.short_term_plan_id}/daily_plans/active_plans/${plan_id}/seconds.json`, seconds+addedSeconds);
            }
        }
        setIsClockActive(isClockActive => !isClockActive);
    }

    const dateChangeHandler = (date) => {
        // Show the date on the page
        setDate(_date => date.toISOString().slice(0,10));

        // Update the plan with the date
        console.log("Updating the database...");
        axios.put(`long_term_plans/active_plans/${props.long_term_plan_id}/short_term_plans/active_plans/${props.short_term_plan_id}/daily_plans/active_plans/${props.plan_id}/date.json`, {val: date.toISOString().slice(0,10)});
    }

    const dateTransformHandler = (date) => {
        const cur_date = new Date().toISOString().slice(0,10)
        const cur_date_to_time = new Date(cur_date).getTime()
        const plan_date_to_time = new Date(date).getTime()
        if(plan_date_to_time - cur_date_to_time === -86400000){
            return "Yesterday"
        } else if(plan_date_to_time - cur_date_to_time === 0) {
            return "Today"
        } else if(plan_date_to_time - cur_date_to_time === 86400000) {
            return "Tomorrow"
        } else {
            return date
        }
    }

    // Delete current plan and all its children plans
    const deletePlanHandler = () => {
        // DFS(Depth first search) to get current plan and all its children plans
        let cur_plans = [props.plan]
        let deleted_plans = [props.plan_id]
        while(cur_plans.length !== 0) {
            const cur_plan = cur_plans.pop();
            for(let child_plan_id in cur_plan.children) {
                deleted_plans.push(child_plan_id)
                cur_plans.push(props.all_plans.get(child_plan_id))
            }
        }

        deleted_plans.forEach(plan => {
            console.log("Updating the database...");
            axios.delete(`long_term_plans/active_plans/${props.long_term_plan_id}/short_term_plans/active_plans/${props.short_term_plan_id}/daily_plans/active_plans/${plan}.json`)
            .then(response => {
                if(response.status === 200) {
                    setPlanDeleted(true);
                }
            })
        })

        // Update parent plan if have
        if(props.plan.parent !== "") {
            let new_children = {};
            const parent_plan = props.all_plans.get(props.plan.parent);
            let count = 1;
            for(let child in parent_plan.children){
                if(child !== props.plan_id) {
                    new_children[child] = count;
                    count = count + 1;
                }
            }

            console.log("Updating the database...");
            axios.put(`long_term_plans/active_plans/${props.long_term_plan_id}/short_term_plans/active_plans/${props.short_term_plan_id}/daily_plans/active_plans/${props.plan.parent}/children.json`, new_children)
            .then(response => {
                if(response.status === 200) {
                    setParentPlanUpdated(true);
                }
            })
        } else {
            setParentPlanUpdated(true);
        }
    }

    // Check current plan and all its children plans
    const checkPlanHandler = () => {
        // DFS(Depth first search) to get current plan and all its children plans
        let cur_plans = [props.plan]
        let checked_plans = []
        while(cur_plans.length !== 0) {
            const cur_plan = cur_plans.pop();
            checked_plans.push(cur_plan)
            for(let child_plan_id in cur_plan.children) {
                cur_plans.push(props.all_plans.get(child_plan_id))
            }
        }

        // Post the plan and its children plans to history_plans
        checked_plans.forEach(plan => {
            // Use the completion date for categorizing the history plans
            console.log("Updating the database...");
            axios.post(`long_term_plans/active_plans/${props.long_term_plan_id}/short_term_plans/active_plans/${props.short_term_plan_id}/daily_plans/history_plans.json`, plan);
        })

        // Delete the plan and its children plans from active_plans
        deletePlanHandler();
    }

    if(planDeleted === true && parentPlanUpdated === true) {
        setPlanDeleted(false)
        setParentPlanUpdated(false)

        // Refresh the page
        window.location.reload();
    }

    return (
        <React.Fragment>
            <Row>
                <Col xs={1} />
                <Col xs='auto'>
                    <div className={classes.expand_collapse} onClick={props.childrenToggleHandler} >
                        {/* Ternary expression: render the icon conditionally based on the state show_children using ternary operator */}
                        {
                            // do not show the expand/shrink icon if no children
                            (typeof props.plan.children !== 'undefined') &&
                            (
                                props.show_children ?
                                <img className={classes.expand_collapse_img} src='https://img.icons8.com/ios-filled/50/000000/collapse-arrow.png'  alt='collapse' /> :
                                <img className={classes.expand_collapse_img} src='https://img.icons8.com/material-rounded/24/000000/more-than.png' alt='expand' />
                            )
                        }
                    </div>
                </Col>

                <Col xs={{ span: 4}} style={{display:'flex', justifyContent:'left'}}>
                    <div style={{'textIndent':`calc(${props.plan.rank} * 20px)`}}>{props.plan.title || 'No title'}</div>
                </Col>

                <Col xs="auto" style={{padding: 0}}>
                    <div className={classes.plan_add_button} onClick={formToggleHandler}>+</div>
                </Col>

                <Col xs={2}>
                    <Timer seconds={seconds} setSeconds={setSeconds} isClockActive={isClockActive} />
                </Col>

                <Col xs={1}>
                    <div>{dateTransformHandler(_date)}</div>
                </Col>

                <Col xs="auto" style={{padding: 0}}>
                    <img className={classes.plan_calendar_icon} onClick={calendarToggleHandler} src="https://img.icons8.com/windows/32/000000/calendar.png" alt='calendar' />
                    {showCalendar &&
                        <React.Fragment>
                            <Backdrop onClick={calendarToggleHandler} />
                            <div className={classes.plan_calendar}>
                                <Calendar onChange={dateChangeHandler}/>
                            </div>
                        </React.Fragment>
                    }
                </Col>

                <Col xs="auto" style={{padding: 0}}>
                    <img className={classes.plan_clock_button} onClick={clockToggleHandler} src="https://img.icons8.com/ios-glyphs/30/000000/--pocket-watch.png" alt=''/>
                </Col>

                {/* Delete a plan */}
                <Col xs="auto" style={{padding: 0}}>
                    <img className={classes.plan_deletion_button} onClick={deletePlanHandler} src="https://img.icons8.com/ios-filled/50/null/multiply.png" alt=''/>
                </Col>

                {/* Check a plan */}
                <Col xs="auto" style={{padding: 0}}>
                    <img className={classes.plan_check_button} onClick={checkPlanHandler} src="https://img.icons8.com/ios-filled/50/null/checkmark--v1.png" alt='' />
                </Col>
            </Row>

            <Row>
                {
                    showForm &&
                    <Container fluid>
                        <Row>
                            <Col xs={1}></Col>
                            {/* <Col xs="auto"><div style={{width: `calc(20px + ${data.rank} * 20px)`}}></div></Col> */}
                            <Col xs={{ span: 5}} style={{display:'flex', justifyContent:'left'}}>
                                <NewPlanForm
                                    long_term_plan_id={props.long_term_plan_id}
                                    short_term_plan_id={props.short_term_plan_id}
                                    form_toggler={formToggleHandler}
                                    parent_plan={props.plan}
                                    parent={props.plan_id}
                                    rank={props.plan.rank+1}
                                />
                            </Col>
                        </Row>
                    </Container>
                    
                }
            </Row>

        </React.Fragment>
    )
}

export default Plan;


/* ========== Learning ========== */
/* axios update string value */
// For some reasons, axios.put cannot update string value though it
// can update number/boolean value directly