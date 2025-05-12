import React, { useState, useEffect, useContext, useRef } from 'react';
import { useDispatch } from 'react-redux';

/* ========== import React components ========== */
import NewDailyPlanForm from '../../Plans/DailyPlans/NewDailyPlanForm';
import Backdrop from '../../UI/Backdrop';
import AuthContext from '../../../store/auth-context';
import Timer from '../../Timer/Timer';

/* ========== import other libraries ========== */
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Calendar from 'react-calendar';
import { activePlanActions } from '../../../store/slices/active-plan-slice';
import { sendDailyPlanData, updateToday } from '../../../store/slices/active-plan-actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretUp, faCaretRight } from '@fortawesome/free-solid-svg-icons';

/* ========== import css ========== */
import classes from './TodayPlan.module.css';

const TodayPlan = (props) => {
    const dispatch = useDispatch();
    let inputExpectedHours = useRef();
    let inputExpectedMinutes = useRef();
    const authCtx = useContext(AuthContext);
    const [seconds, setSeconds] = useState(props.today_plan.seconds);
    const [showForm, setShowForm] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [isAddNewPlan, setIsAddNewPlan] = useState(false);
    const [_date, setDate] = useState(props.today_plan.date);
    const [todayPlanChanged, setTodayPlanChanged] = useState(false);

    useEffect(() => {
        if(todayPlanChanged === true) {
            dispatch(sendDailyPlanData(authCtx.userID, props.plan))
            dispatch(updateToday(authCtx.userID,
                props.plan.today.date,
                props.plan.today.today_plans,
                props.plan.today.used_time))
            setTodayPlanChanged(false);
        }
    }, [dispatch, authCtx.userID, props.plan, todayPlanChanged])

    useEffect(() => {
        if(isAddNewPlan) {
            dispatch(sendDailyPlanData(authCtx.userID, props.plan));
            dispatch(updateToday(authCtx.userID,
                props.plan.today.date,
                props.plan.today.today_plans,
                props.plan.today.used_time))
            setIsAddNewPlan(false);
        }
    }, [dispatch, authCtx.userID, props.plan, isAddNewPlan])

    const formToggleHandler = () => {
        setShowForm(!showForm);
    }

    const childrenToggleHandler = () => {
        if(props.show_children) {
            dispatch(
                activePlanActions.hideChildPlan({
                    id:props.today_plan.id
                })
            )
        } else {
            dispatch(
                activePlanActions.showChildPlan({
                    id:props.today_plan.id
                })
            );
        }
    }

    const expectedHoursChangeHandler = () => {
        dispatch(
            activePlanActions.setExpectedHours({
                id: props.today_plan.id,
                hours:inputExpectedHours.current.value
            })
        )
        setTodayPlanChanged(true);
    }

    const expectedMinutesChangeHandler = () => {
        dispatch(
            activePlanActions.setExpectedMinutes({
                id: props.today_plan.id,
                minutes:inputExpectedMinutes.current.value
            })
        )
        setTodayPlanChanged(true);
    }

    const highlightHandler = () => {
        props.setHighlight(props.today_plan.id);
    }

    const calendarToggleHandler = () => {
        setShowCalendar(showCalendar => !showCalendar)
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
            props.setTimerHolder(props.today_plan.id);
        }
        if(props.isTimerActive === true && props.timerHolder !== props.today_plan.id) {
            alert("Only one timer can be active at a time!")
            return
        }
        if(props.isTimerActive === true && props.timerHolder === props.today_plan.id) {
            // Update both current plan and its parent plans
            dispatch(
                activePlanActions.updateTime({
                    index:props.index,
                    seconds:seconds,
                    new_seconds: seconds-props.today_plan.seconds
                })
            )
            // Upload the latest time to database after stopping the timer
            setTodayPlanChanged(true);
            props.setIsTimerActive(false);
            props.setTimerHolder(null);
        }
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
                id:props.today_plan.id,
                date:dateToSet
            })
        )
        // After chaing date, TodayPlan won't be rendered, useEffect() won't run.
        // We should run side effect - useEffect() from parent
        props.set_plan_removed(true);
    }

    const deletePlanHandler = () => {
        // Delete current plan and all its children plans
        dispatch(
            activePlanActions.deleteDailyPlan({
                index:props.index
            })
        )
        dispatch(
            activePlanActions.deleteTodayPlan({
                id: props.today_plan.id,
            })
        )
        // setTodayPlanChanged(true) does NOT trigger useEffect any more
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

    const getTodayDateString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
        const day = today.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <React.Fragment>
            <Row
                className={`${classes.row} ${props.highlight === props.today_plan.id ? classes.highlight : ''}`}
                onClick={highlightHandler}
            >
                {/* Check a plan */}
                <Col xs="auto" style={{paddingLeft: 0, paddingRight: "15px", width: "30px"}}>
                    {props.highlight === props.today_plan.id  && (
                        <img className={classes.plan_check_button} onClick={checkPlanHandler} src="https://img.icons8.com/ios-filled/50/null/checkmark--v1.png" alt='' />
                    )}
                </Col>
                <Col xs={{ span: 5 }}>
                    <div style={{display:'flex', justifyContent:'left', padding: 0, paddingLeft:`calc(${props.today_plan.rank} * 20px)`}}>
                        <div className={classes.expand_collapse} onClick={childrenToggleHandler} >
                            {/* Ternary expression: render the icon conditionally based on the state show_children using ternary operator */}
                            {
                                // do not show the expand/shrink icon if no children
                                (props.today_plan.has_children) &&
                                (
                                    props.show_children ?
                                    <FontAwesomeIcon className={classes.expand_collapse_img} icon={faCaretUp} color="#333" title="caretUp" />:
                                    <FontAwesomeIcon className={classes.expand_collapse_img} icon={faCaretRight} color="#333" title="caretRight" />
                                )
                            }
                        </div>
                        <div>{props.today_plan.title || 'No title'}</div>
                    </div>
                </Col>
                {/* p-0: Padding of 0 */}
                {/* Override the css style flex: 1 0; as it's the default behavior of the react-bootstrap Col component */}
                <Col className="p-0" style={{width: '9%', flex: '0 0 auto'}}>
                    <input className={classes.input_time} type="number" ref={inputExpectedHours} onBlur={expectedHoursChangeHandler} defaultValue={props.today_plan.expected_hours} />:
                    <input className={classes.input_time} type="number" ref={inputExpectedMinutes} onBlur={expectedMinutesChangeHandler} defaultValue={props.today_plan.expected_minutes} />
                </Col>
                <Col xs={1} style={{width: '5%', padding: 0}}>
                    <Timer
                        id={props.today_plan.id}
                        used_seconds={props.today_plan.seconds}
                        seconds={seconds}
                        setSeconds={setSeconds}
                        isTimerActive={props.isTimerActive}
                        timerHolder={props.timerHolder} />
                </Col>
                {/* Show the date of the plan */}
                <Col style={{maxWidth: "10%"}}>
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
                {/* Timer */}
                <Col xs="auto" style={{padding: 0}}>
                    <img className={classes.plan_timer_button} onClick={timerToggleHandler} src="https://img.icons8.com/ios-glyphs/30/000000/--pocket-watch.png" alt=''/>
                </Col>
                {/* Delete a plan */}
                <Col xs="auto" style={{padding: 0}}>
                    <img className={classes.plan_deletion_button} onClick={deletePlanHandler} src="https://img.icons8.com/ios-filled/50/null/multiply.png" alt=''/>
                </Col>
                {/* Add sub-task */}
                <Col xs="auto" style={{paddingLeft: '15px'}}>
                    <div className={classes.plan_add_button} onClick={formToggleHandler}>+</div>
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
                                    parent_id={props.today_plan.id}
                                    rank={props.today_plan.rank+1}
                                    index={props.index} // used to decide where to insert the new daily plan to daily_plans
                                    date={getTodayDateString()}
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

export default TodayPlan