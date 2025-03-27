import React, { useState, useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';

/* ========== import React components ========== */
import Backdrop from '../../UI/Backdrop';
import AuthContext from '../../../store/auth-context';

/* ========== import other libraries ========== */
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Calendar from 'react-calendar';
import { activePlanActions } from '../../../store/slices/active-plan-slice';
import { sendDailyPlanData } from '../../../store/slices/active-plan-actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretUp, faCaretRight } from '@fortawesome/free-solid-svg-icons';

/* ========== import css ========== */
import classes from './TodayPlan.module.css';

const TodayPlan = (props) => {
    const dispatch = useDispatch();
    const authCtx = useContext(AuthContext);
    const [showCalendar, setShowCalendar] = useState(false);
    const [_date, setDate] = useState(props.plan.date);
    const [todayPlanChanged, setTodayPlanChanged] = useState(false);

    useEffect(() => {
        if(todayPlanChanged === true) {
            dispatch(sendDailyPlanData(authCtx.userID, props.plan))
            setTodayPlanChanged(false);
        }
    }, [dispatch, authCtx.userID, props.plan, todayPlanChanged])

    const formatToTwoDigits = (n) => {
        if(n < 10 ){
            return `0${n}`;
        } else {
            return `${n}`;
        }
    }

    const secondsToHMS = (seconds) => {
        let hour  = (seconds / 3600) >> 0;
        let minute  = ((seconds % 3600) / 60) >> 0;
        let second  = seconds % 60;

        hour   = formatToTwoDigits(hour);
        minute = formatToTwoDigits(minute);
        second = formatToTwoDigits(second);

        return `${hour}:${minute}:${second}`
    }

    const childrenToggleHandler = () => {
        if(props.show_children) {
            dispatch(
                activePlanActions.hideChildPlan({
                    id:props.plan.id,
                    index:props.index
                })
            )
        } else {
            dispatch(
                activePlanActions.showChildPlan({
                    id:props.plan.id,
                    index:props.index
                })
            );
        }
    }

    const highlightHandler = () => {
        props.setHighlight(props.plan.id);
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
                id:props.plan.id,
                date:dateToSet
            })
        )
        setTodayPlanChanged(true);
    }

    return (
        <React.Fragment>
            <Row
                className={`${classes.row} ${props.highlight === props.plan.id ? classes.highlight : ''}`}
                onClick={highlightHandler}
            >
                <Col xs={{ span: 4 }}>
                    <div style={{display:'flex', justifyContent:'left', padding: 0, 'paddingLeft':`calc(${props.plan.rank} * 20px)`}}>
                        <div className={classes.expand_collapse} onClick={childrenToggleHandler} >
                            {/* Ternary expression: render the icon conditionally based on the state show_children using ternary operator */}
                            {
                                // do not show the expand/shrink icon if no children
                                (props.plan.has_children) &&
                                (
                                    props.show_children ?
                                    <FontAwesomeIcon className={classes.expand_collapse_img} icon={faCaretUp} color="#333" title="caretUp" />:
                                    <FontAwesomeIcon className={classes.expand_collapse_img} icon={faCaretRight} color="#333" title="caretRight" />
                                )
                            }
                        </div>
                        <div>{props.plan.title || 'No title'}</div>
                    </div>
                </Col>
                {/* p-0: Padding of 0 */}
                <Col className="p-0">
                    <div>{props.plan.expected_hours}:{props.plan.expected_minutes}</div>
                </Col>
                <Col className="p-0">
                    <div>{secondsToHMS(props.plan.seconds)}</div>
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
            </Row>
        </React.Fragment>
    )
}

export default TodayPlan