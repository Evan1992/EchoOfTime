import React, { useState, useEffect, useContext, useRef } from 'react';
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
import { backlogPlanActions } from '../../../store/slices/backlog-plan-slice';
import { sendDailyPlanData, updateToday } from '../../../store/slices/active-plan-actions';
import { sendDailyPlanDataToBacklog } from '../../../store/slices/backlog-plan-actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretUp, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { isToday } from '../../../utilities';

/* ========== import css ========== */
import classes from './DailyPlan.module.css';
import 'react-calendar/dist/Calendar.css';   // import this css file to auto style the calendar

const DailyPlan = (props) => {
    const authCtx = useContext(AuthContext);
    const dispatch = useDispatch();
    const plan = useSelector((state) => state.activePlan);
    const backlogPlan = useSelector((state) => state.backlogPlan);
    const [dailyPlanChanged, setDailyPlanChanged] = useState(false);
    const [seconds, setSeconds] = useState(props.daily_plan.seconds);
    const [showForm, setShowForm] = useState(false);
    const [_date, setDate] = useState(props.daily_plan.date);
    const [showCalendar, setShowCalendar] = useState(false);
    const [showPriority, setShowPriority] = useState(false);
    const [priority, setPriority] = useState(props.daily_plan.priority);
    const [isAddNewPlan, setIsAddNewPlan] = useState(false);
    let inputExpectedHours = useRef();
    let inputExpectedMinutes = useRef();

    // When changing parent plan's date, all its children plans' date should be updated
    useEffect(() => {
        if (_date !== props.daily_plan.date) {
            setDate(props.daily_plan.date);
        }
        if (priority !== props.daily_plan.priority) {
            setPriority(props.daily_plan.priority);
        }
    }, [_date, props.daily_plan.date, priority, props.daily_plan.priority])

    useEffect(() => {
        if(dailyPlanChanged === true) {
            if (props.isBacklog) {
                dispatch(sendDailyPlanDataToBacklog(authCtx, backlogPlan));
            } else if(props.isTodoEveryPlan) {
                dispatch(sendDailyPlanData(authCtx, plan));
                dispatch(updateToday(authCtx,
                    plan.today.date,
                    plan.today.today_plans,
                    plan.today.used_time))
            } else {
                dispatch(sendDailyPlanData(authCtx, plan))
                dispatch(updateToday(authCtx,
                    plan.today.date,
                    plan.today.today_plans,
                    plan.today.used_time))
            }
            setDailyPlanChanged(false);
        }
    }, [dispatch, authCtx, props.isBacklog, props.isTodoEveryPlan, plan, backlogPlan, dailyPlanChanged])

    useEffect(() => {
        if(isAddNewPlan) {
            if (props.isBacklog) {
                dispatch(sendDailyPlanDataToBacklog(authCtx, backlogPlan));
            } else {
                dispatch(sendDailyPlanData(authCtx, plan));
                // When adding a new plan, update today_plans as well no matter whether the new plan's date is today or not
                dispatch(updateToday(authCtx,
                    plan.today.date,
                    plan.today.today_plans,
                    plan.today.used_time))
            }
            setIsAddNewPlan(false);
        }
    }, [dispatch, authCtx, props.isBacklog, plan, backlogPlan, isAddNewPlan])

    const formToggleHandler = () => {
        setShowForm(!showForm);
    }

    const childrenToggleHandler = () => {
        if(props.show_children) {
            if (props.isBacklog) {
                dispatch(
                    backlogPlanActions.hideChildPlan({
                        id: props.id,
                    })
                );
            } else {
                dispatch(
                    activePlanActions.hideChildPlan({
                        id:props.id
                    })
                );
            }
        } else {
            if (props.isBacklog) {
                dispatch(
                    backlogPlanActions.showChildPlan({
                        id: props.id,
                    })
                );
            } else {
                dispatch(
                    activePlanActions.showChildPlan({
                        id:props.id
                    })
                );
            }
        }
    }

    const expectedHoursChangeHandler = (event) => {
        if (props.isBacklog) {
            dispatch(
                backlogPlanActions.setExpectedHours({
                    id: props.id,
                    hours: event.target.value
                })
            )
        } else if (props.isTodoEveryPlan) {
            dispatch(
                activePlanActions.setExpectedHours({
                    id: props.id,
                    hours:event.target.value,
                    isTodoEveryPlan: true
                })
            )
        } else {
            dispatch(
                activePlanActions.setExpectedHours({
                    id: props.id,
                    hours:event.target.value
                })
            )
        }

        setDailyPlanChanged(true);
    }

    const expectedMinutesChangeHandler = (event) => {
        if (props.isBacklog) {
            dispatch(
                backlogPlanActions.setExpectedMinutes({
                    id: props.id,
                    minutes: event.target.value
                })
            )
        } else if (props.isTodoEveryPlan) {
            dispatch(
                activePlanActions.setExpectedMinutes({
                    id: props.id,
                    minutes:event.target.value,
                    isTodoEveryPlan: true
                })
            )
        } else {
            dispatch(
                activePlanActions.setExpectedMinutes({
                    id: props.id,
                    minutes:event.target.value
                })
            )
        }

        setDailyPlanChanged(true);
    }

    const highlightHandler = () => {
        props.setHighlight(props.daily_plan.id);
    }

    const priorityToggleHandler = () => {
        setShowPriority(showPriority => !showPriority)
    }

    const priorityChangeHandler = (priority) => {
        setPriority(priority);
        setShowPriority(false);

        if (props.isBacklog) {
            // TODO
        } else if (props.isTodoEveryPlan) {
            dispatch(
                activePlanActions.setPriority({
                    id: props.id,
                    priority,
                    isTodoEveryPlan: true
                })
            )
        } else {
            dispatch(
                activePlanActions.setPriority({
                    id: props.id,
                    priority
                })
            )
        }

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
        if (props.isBacklog) {
            dispatch(
                backlogPlanActions.setDate({
                    id:props.id,
                    date:dateToSet
                })
            )
        } else if (props.isTodoEveryPlan) {
            dispatch(
                activePlanActions.setDate({
                    id:props.id,
                    date:dateToSet,
                    isTodoEveryPlan: true
                })
            )
        } else {
            dispatch(
                activePlanActions.setDate({
                    id:props.id,
                    date:dateToSet
                })
            )
        }

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

        const now = new Date();
        let cur_date = new Date(now.toLocaleDateString());
        let plan_date = new Date(plan_date_string);

        // Set time components to zero
        cur_date.setHours(0, 0, 0, 0);
        plan_date.setHours(0, 0, 0, 0);

        // If before 2:00am, treat as Today (previous calendar day)
        // If 2:00am or later, treat as Tomorrow (current calendar day + 1)
        if (now.getHours() < 2) {
            // Before 2:00am, treat as today (previous calendar day)
            cur_date.setDate(cur_date.getDate() - 1);
        }

        const cur_date_to_time = cur_date.getTime();
        const plan_date_to_time = plan_date.getTime();

        // Adjust for DST
        const cur_date_offset = cur_date.getTimezoneOffset();
        const plan_date_offset = plan_date.getTimezoneOffset();
        const offset_difference = (cur_date_offset - plan_date_offset) * 60 * 1000;

        const time_difference = plan_date_to_time - cur_date_to_time + offset_difference;
        const ONE_DAY_MS = 24 * 60 * 60 * 1000;

        if (time_difference === 0) {
            return "Today";
        } else if (time_difference === ONE_DAY_MS) {
            return "Tomorrow";
        } else if (time_difference === -ONE_DAY_MS) {
            return "Yesterday";
        } else {
            return date;
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
            if (props.isBacklog) {
                dispatch(
                    backlogPlanActions.updateTime({
                        id: props.id,
                        seconds: seconds,
                        new_seconds: seconds-props.daily_plan.seconds
                    })
                )
            } else if (props.isTodoEveryPlan) {
                dispatch(
                    activePlanActions.updateTime({
                        id: props.id,
                        seconds: seconds,
                        new_seconds: seconds-props.daily_plan.seconds,
                        isTodoEveryPlan: true
                    })
                )
            } else {
                dispatch(
                    activePlanActions.updateTime({
                        id: props.id,
                        seconds:seconds,
                        new_seconds: seconds-props.daily_plan.seconds
                    })
                )
            }

            // Upload the latest time to database after stopping the timer
            setDailyPlanChanged(true);
            props.setIsTimerActive(false);
            props.setTimerHolder(null);
        }
    }

    const deletePlanHandler = () => {
        // Delete current plan and all its children plans
        if (props.isBacklog) {
            dispatch(
                backlogPlanActions.deleteDailyPlan({
                    id:props.id,
                    parent_id: props.daily_plan.parent_id
                })
            )
        } else if (props.isTodoEveryPlan) {
            dispatch(
                activePlanActions.deleteDailyPlanForTodoEveryPlan({
                    id:props.id,
                    parent_id: props.daily_plan.parent_id
                })
            )
        } else {
            dispatch(
                activePlanActions.deleteDailyPlan({
                    id:props.id,
                    parent_id: props.daily_plan.parent_id
                })
            )
        }

        if (isToday(props.daily_plan.date)) {
            dispatch(
                activePlanActions.deleteTodayPlan({
                    id: props.id
                })
            )
        }
        // setDailyPlanChanged(true) does NOT trigger useEffect any more
        // because the daily plan is deleted and DailyPlan component will
        // NOT be re-rendered. We are supposed to update the database on
        // the upper layer DailyPlans
        props.set_plan_deleted(true);
    }

    const checkPlanHandler = () => {
        if (props.isBacklog) {
            dispatch(
                backlogPlanActions.deleteDailyPlan({
                    id: props.id,
                    parent_id: props.daily_plan.parent_id
                })
            )
        } else if (props.isTodoEveryPlan) {
            dispatch(
                activePlanActions.checkTodayPlan({
                    id: props.id,
                })
            )
        } else {
            dispatch(
                activePlanActions.checkDailyPlan({
                    id: props.id,
                    parent_id: props.daily_plan.parent_id
                })
            )
            if (isToday(props.daily_plan.date)) {
                dispatch(
                    activePlanActions.checkTodayPlan({
                        id: props.id,
                    })
                )
            }
        }
        props.set_plan_deleted(true);
    }

    return (
        <React.Fragment>
            <Row
                className={`${classes.row} ${props.highlight === props.daily_plan.id ? classes.highlight : ''}`}
                onClick={highlightHandler}
            >

                <Col xs={2} className={classes.placeholder_col} />
                {/* Set fixed width for this column */}
                <Col xs={{ span: 4 }}>
                    {/* Use paddingLeft instead of textIndent as it causes bug for the css style applied to the icon */}
                    <div style={{display:'flex', justifyContent:'left', padding: 0, 'paddingLeft':`calc(${props.daily_plan.rank} * 20px)`}}>
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
                    <input className={classes.input_time} type="number" ref={inputExpectedHours} onBlur={expectedHoursChangeHandler} defaultValue={props.daily_plan.expected_hours} />:
                    <input className={classes.input_time} type="number" ref={inputExpectedMinutes} onBlur={expectedMinutesChangeHandler} defaultValue={props.daily_plan.expected_minutes} />
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

                {/* Priority */}
                <Col xs="auto" style={{padding: 0, width: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    {priority === 0 ? (
                        <img className={classes.calendar_icon} onClick={priorityToggleHandler} src="https://img.icons8.com/?size=100&id=5342&format=png&color=000000" alt='priority' />
                    ) : (
                        <div onClick={priorityToggleHandler} style={{cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', width: '100%', textAlign: 'center', color: priority === 1 ? '#ff6b6b' : priority === 2 ? '#ffb800' : '#51cf66'}}>
                            {priority}
                        </div>
                    )}
                    {showPriority &&
                        <React.Fragment>
                            <Backdrop onClick={priorityToggleHandler} />
                            <div className={classes.calendar} style={{display: 'flex', flexDirection: 'column', gap: '5px', padding: '8px'}}>
                                <button
                                    style={{
                                        padding: '6px 12px',
                                        fontSize: '14px',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        backgroundColor: '#fff',
                                        color: '#ff6b6b',
                                        fontWeight: 'bold'
                                    }}
                                    onClick={() => priorityChangeHandler(1)}
                                >
                                    1
                                </button>
                                <button
                                    style={{
                                        padding: '6px 12px',
                                        fontSize: '14px',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        backgroundColor: '#fff',
                                        color: '#ffb800',
                                        fontWeight: 'bold'
                                    }}
                                    onClick={() => priorityChangeHandler(2)}
                                >
                                    2
                                </button>
                                <button
                                    style={{
                                        padding: '6px 12px',
                                        fontSize: '14px',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        backgroundColor: '#fff',
                                        color: '#51cf66',
                                        fontWeight: 'bold'
                                    }}
                                    onClick={() => priorityChangeHandler(3)}
                                >
                                    3
                                </button>
                            </div>
                        </React.Fragment>
                    }
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

                <Col className={classes.placeholder_col} />
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
                                    formToggler={formToggleHandler}
                                    setIsAddNewPlan={setIsAddNewPlan}
                                    isBacklog={props.isBacklog}
                                    isTodoEveryPlan={props.isTodoEveryPlan}
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