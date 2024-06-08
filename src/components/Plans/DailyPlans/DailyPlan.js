import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

/* ========== import React components ========== */
import NewDailyPlanForm from './NewDailyPlanForm';
import Timer from '../../Timer/Timer';
import Backdrop from '../../UI/Backdrop';

/* ========== import other libraries ========== */
import Calendar from 'react-calendar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { activePlanActions } from '../../../store/slices/active-plan-slice';
import { sendDailyPlanData } from '../../../store/slices/active-plan-actions';

/* ========== import css ========== */
import classes from './DailyPlan.module.css';

const DailyPlan = (props) => {
    const dispatch = useDispatch();
    const [dailyPlanChanged, setDailyPlanChanged] = useState(false);
    const [seconds, setSeconds] = useState(props.daily_plan.seconds);
    const [isClockActive, setIsClockActive] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [_date, setDate] = useState(props.daily_plan.date);
    const [showCalendar, setShowCalendar] = useState(false);

    useEffect(() => {
        if(dailyPlanChanged === true) {
            dispatch(sendDailyPlanData(props.plan))
            setDailyPlanChanged(false);
        }
    }, [dispatch, props.plan, dailyPlanChanged])

    const formToggleHandler = () => {
        setShowForm(!showForm);
    }

    const childrenToggleHandler = () => {
        if(props.show_children) {
            dispatch(
                activePlanActions.hideChildPlan({
                    id:props.id,
                    index:props.index
                })
            )
        } else {
            dispatch(
                activePlanActions.showChildPlan({
                    id:props.id,
                    index:props.index
                })
            );
        }
    }

    const expectedHoursChangeHandler = (event) => {
        dispatch(
            activePlanActions.setExpectedHours({
                index:props.index,
                hours:event.target.value
            })
        )
        setDailyPlanChanged(true);
    }

    const expectedMinutesChangeHandler = (event) => {
        dispatch(
            activePlanActions.setExpectedMinutes({
                index:props.index,
                minutes:event.target.value
            })
        )
        setDailyPlanChanged(true);
    }

    const calendarToggleHandler = () => {
        setShowCalendar(showCalendar => !showCalendar)
    }

    const dateChangeHandler = (date) => {
        // Show the date on the page
        setDate(_date => date.toISOString().slice(0,10));

        // Update the plan with the date.
        dispatch(
            activePlanActions.setDate({
                index:props.index,
                date:date.toISOString().slice(0,10)
            })
        )
        setDailyPlanChanged(true);
    }

    const dateTransformHandler = (date) => {
        /**
         * date's format is yyyy-mm-dd, somehow, new Date(date) will use UTC to parse it,
         * while if date's format is mm/dd/yyyy, new Date(date) will use local time zone to parse it.
         * As a result, we should convert yyyy-mm-dd to mm/dd/yyyy first
         */
        let plan_date
        if(date) {
            const splitted_date = date.split("-")
            const yy = splitted_date[0]
            const mm = splitted_date[1]
            const dd = splitted_date[2]
            plan_date = mm.concat("/", dd, "/", yy)
        }

        const cur_date = new Date().toLocaleDateString()

        const cur_date_to_time = new Date(cur_date).getTime()
        const plan_date_to_time = new Date(plan_date).getTime()

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

    const clockToggleHandler = () => {
        if(isClockActive === true) {
            // Update both current plan and its parent plans
            dispatch(
                activePlanActions.updateTime({
                    index:props.index,
                    seconds:seconds,
                    new_seconds: seconds-props.daily_plan.seconds
                })
            )
            // Upload the latest time to database after stopping the timer
            setDailyPlanChanged(true);
        }

        setIsClockActive(isClockActive => !isClockActive);
    }

    const deletePlanHandler = () => {
        // Delete current plan and all its children plans
        dispatch(
            activePlanActions.deleteDailyPlan({
                index:props.index
            })
        )
        // setDailyPlanChanged(true) does NOT trigger useEffect any more
        // because the daily plan is deleted and DailyPlan component will
        // NOT be re-rendered. We are supposed to update the database on
        // the upper layer DailyPlans
        props.set_plan_deleted(true);
    }

    const checkPlanHandler = () => {
        dispatch(
            activePlanActions.checkDailyPlan({
                index:props.index
            })
        )
        props.set_plan_deleted(true);
    }

    return (
        <React.Fragment>
            <Row>
                <Col xs={1} />
                <Col xs='auto'>
                    <div className={classes.expand_collapse} onClick={childrenToggleHandler} >
                        {/* Ternary expression: render the icon conditionally based on the state show_children using ternary operator */}
                        {
                            // do not show the expand/shrink icon if no children
                            (props.daily_plan.has_children) &&
                            (
                                props.show_children ?
                                <img className={classes.expand_collapse_img} src='https://img.icons8.com/ios-filled/50/000000/collapse-arrow.png'  alt='collapse' /> :
                                <img className={classes.expand_collapse_img} src='https://img.icons8.com/material-rounded/24/000000/more-than.png' alt='expand' />
                            )
                        }
                    </div>
                </Col>

                <Col xs={{ span: 4}} style={{display:'flex', justifyContent:'left'}}>
                    <div style={{'textIndent':`calc(${props.daily_plan.rank} * 20px)`}}>{props.daily_plan.title || 'No title'}</div>
                </Col>

                <Col xs="auto" style={{padding: 0}}>
                    <div className={classes.plan_add_button} onClick={formToggleHandler}>+</div>
                </Col>

                <Col xs="auto" style={{padding: 0}}>
                    <div>
                        <input className={classes.input_time} type="number" onChange={expectedHoursChangeHandler} value={props.daily_plan.expected_hours} />:
                        <input className={classes.input_time} type="number" onChange={expectedMinutesChangeHandler} value={props.daily_plan.expected_minutes} />
                    </div>
                </Col>

                <Col xs={2}>
                    <Timer used_seconds={props.daily_plan.seconds} seconds={seconds} setSeconds={setSeconds} isClockActive={isClockActive} />
                </Col>

                {/* Show the date of the plan */}
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
                            <Col xs={{ span: 5}} style={{display:'flex', justifyContent:'left'}}>
                                <NewDailyPlanForm
                                    parent_id={props.id}
                                    rank={props.rank+1}
                                    index={props.index} // used to decide where to insert the new daily plan to daily_plans
                                    formToggler={formToggleHandler}
                                />
                            </Col>
                        </Row>
                    </Container>
                }
            </Row>
        </React.Fragment>
    )
}

export default DailyPlan;