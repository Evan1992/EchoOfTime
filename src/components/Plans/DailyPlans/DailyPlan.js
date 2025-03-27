import React, { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/* ========== import React components ========== */
import NewDailyPlanForm from './NewDailyPlanForm';
import Timer from '../../Timer/Timer';
import Backdrop from '../../UI/Backdrop';
import AuthContext from '../../../store/auth-context';

/* ========== import other libraries ========== */
import Calendar from 'react-calendar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { activePlanActions } from '../../../store/slices/active-plan-slice';
import { sendDailyPlanData } from '../../../store/slices/active-plan-actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretUp, faCaretRight } from '@fortawesome/free-solid-svg-icons';

/* ========== import css ========== */
import classes from './DailyPlan.module.css';
import 'react-calendar/dist/Calendar.css';   // import this css file to auto style the calendar

const DailyPlan = (props) => {
    const authCtx = useContext(AuthContext);
    const dispatch = useDispatch();
    const plan = useSelector((state) => state.activePlan);
    const [dailyPlanChanged, setDailyPlanChanged] = useState(false);
    const [seconds, setSeconds] = useState(props.daily_plan.seconds);
    const [showForm, setShowForm] = useState(false);
    const [_date, setDate] = useState(props.daily_plan.date);
    const [showCalendar, setShowCalendar] = useState(false);
    const [isAddNewPlan, setIsAddNewPlan] = useState(false);

    // When changing parent plan's date, all its children plans' date should be updated
    useEffect(() => {
        if (_date !== props.daily_plan.date) {
            setDate(props.daily_plan.date);
        }
    }, [_date, props.daily_plan.date])

    useEffect(() => {
        if(dailyPlanChanged === true) {
            dispatch(sendDailyPlanData(authCtx.userID, props.plan))
            setDailyPlanChanged(false);
        }
    }, [dispatch, authCtx.userID, props.plan, dailyPlanChanged])

    useEffect(() => {
        if(isAddNewPlan) {
            dispatch(sendDailyPlanData(authCtx.userID, plan));
            setIsAddNewPlan(false);
        }
    }, [dispatch, authCtx.userID, plan, isAddNewPlan])

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

    const dateChangeHandler = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();       // Gets the year
        const month = date.getMonth() + 1;     // Gets the month (0-indexed, so add 1)
        const day = date.getDate();            // Gets the day of the month
        // Format the date as needed, for example: "YYYY-MM-DD"
        const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

        // Toggle the date
        let dateToSet;
        if(_date === formattedDate) {
            dateToSet = "";
        } else {
            dateToSet = formattedDate
        }

        setDate(_date => dateToSet);
        // Update the plan with the date.
        dispatch(
            activePlanActions.setDate({
                id:props.id,
                date:dateToSet
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
        let plan_date_string
        if(date) {
            const splitted_date = date.split("-")
            const yy = splitted_date[0]
            const mm = splitted_date[1]
            const dd = splitted_date[2]
            plan_date_string = mm.concat("/", dd, "/", yy)
        }

        const cur_date_string = new Date().toLocaleDateString();
        const cur_date = new Date(cur_date_string);
        const plan_date = new Date(plan_date_string);

        // Set time components to zero
        cur_date.setHours(0, 0, 0, 0);
        plan_date.setHours(0, 0, 0, 0);

        const cur_date_to_time = cur_date.getTime();
        const plan_date_to_time = plan_date.getTime();

        // Adjust for DST
        const cur_date_offset = cur_date.getTimezoneOffset();
        const plan_date_offset = plan_date.getTimezoneOffset();
        const offset_difference = (cur_date_offset - plan_date_offset) * 60 * 1000;

        const time_difference = plan_date_to_time - cur_date_to_time + offset_difference;
        if(time_difference === -86400000){
            return "Yesterday"
        } else if(time_difference === 0) {
            return "Today"
        } else if(time_difference === 86400000) {
            return "Tomorrow"
        } else {
            return date
        }
    }

    const timerToggleHandler = () => {
        if(props.isTimerActive === false && props.timerHolder === null) {
            props.setIsTimerActive(true);
            props.setTimerHolder(props.id);
        }
        if(props.isTimerActive === true && props.timerHolder !== props.id) {
            alert("Only one timer can be active at a time!")
            return
        }
        if(props.isTimerActive === true && props.timerHolder === props.id) {
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
            props.setIsTimerActive(false);
            props.setTimerHolder(null);
        }
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
            <Row className={classes.row}>
                {/* Set fixed width for this column */}
                <Col xs={{ span: 4 }}>
                    <div style={{display:'flex', justifyContent:'left', padding: 0, 'textIndent':`calc(${props.daily_plan.rank} * 20px)`}}>
                        <div className={classes.expand_collapse} onClick={childrenToggleHandler}  >
                            {/* Ternary expression: render the icon conditionally based on the state show_children using ternary operator */}
                            {
                                // do not show the expand/shrink icon if no children
                                (props.daily_plan.has_children) &&
                                (
                                    props.show_children ?
                                    <FontAwesomeIcon className={classes.expand_collapse_img} icon={faCaretUp} color="#333" title="caretUp" />:
                                    <FontAwesomeIcon className={classes.expand_collapse_img} icon={faCaretRight} color="#333" title="caretRight" />
                                )
                            }
                        </div>
                        <div>{props.daily_plan.title || 'No title'}</div>
                    </div>
                </Col>

                <Col xs="auto" style={{padding: 0}}>
                    <div className={classes.plan_add_button} onClick={formToggleHandler}>+</div>
                </Col>

                <Col xs="auto">
                    <input className={classes.input_time} type="number" onChange={expectedHoursChangeHandler} value={props.daily_plan.expected_hours} />:
                    <input className={classes.input_time} type="number" onChange={expectedMinutesChangeHandler} value={props.daily_plan.expected_minutes} />
                </Col>

                <Col xs={1} style={{padding: 0}}>
                    <Timer
                        id={props.id}
                        used_seconds={props.daily_plan.seconds}
                        seconds={seconds}
                        setSeconds={setSeconds}
                        isTimerActive={props.isTimerActive}
                        timerHolder={props.timerHolder} />
                </Col>

                {/* Show the date of the plan */}
                <Col style={{'maxWidth': "10%"}}>
                    {dateTransformHandler(_date)}
                </Col>

                {/* Calendar */}
                <Col xs="auto" style={{padding: 0}}>
                    <img className={classes.calendar_icon} onClick={calendarToggleHandler} src="https://img.icons8.com/windows/32/000000/calendar.png" alt='calendar' />
                    {showCalendar &&
                        <React.Fragment>
                            <Backdrop onClick={calendarToggleHandler} />
                            <div className={classes.calendar}>
                                <Calendar onChange={dateChangeHandler}/>
                            </div>
                        </React.Fragment>
                    }
                </Col>

                <Col xs="auto" style={{padding: 0}}>
                    <img className={classes.plan_timer_button} onClick={timerToggleHandler} src="https://img.icons8.com/ios-glyphs/30/000000/--pocket-watch.png" alt=''/>
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
                                    setIsAddNewPlan={setIsAddNewPlan}
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



/* ========== Learning ========== */
/* instance update string value */
// For some reasons, instance.put cannot update string value though it
// can update number/boolean value directly

/* setState and callback */
// After setState, like setExpectedHours(expectedHours => event.target.value);
// The expectedHours is not immediately changed. So if we want to perform an
// action immediately after setting state on a state variable and then return
// a result, a callback will be useful. However, useState() Hooks doesn't support
// the second callback argument. To execute a side effect after rendering, declare
// it in the component body with useEffect().
// Reference: https://stackoverflow.com/questions/42038590/when-to-use-react-setstate-callback

/* update database with string value */
// For the key-value pair stored in firebase, when we want to update
// the string value, we are supposed to specify the headers. Otherwise,
// the put request will fail
// Reference: https://stackoverflow.com/questions/43573297/put-request-with-simple-string-as-request-body

/* CSS style - size of <input> */
// We can specify the size of the <input> if the type is text, like <input type="text">
// We cannot specify the size of the <input> if the type is number, like <input type="number">
// Reference: https://stackoverflow.com/questions/22709792/input-type-number-wont-resize