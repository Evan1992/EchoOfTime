import { useState, useEffect } from 'react';
import { focusTimerActions } from '../../store/slices/focus-timer-slice';
import { useDispatch } from 'react-redux';

const Timer = (props) => {
    const dispatch = useDispatch();
    const [startTime, setStartTime] = useState(Date.now());
    const [startTimeSetted, setStartTimeSetted] = useState(false);

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

    if (props.isTimerActive === true &&
        props.timerHolder === props.id &&
        startTimeSetted === false) {
        setStartTime(Date.now());
        setStartTimeSetted(true);
    }

    useEffect(() => {
        let elapsedMilliseconds = Date.now() - startTime;
        let elapsedSeconds = Math.ceil(elapsedMilliseconds / 1000) === 0 ? 1 : Math.ceil(elapsedMilliseconds / 1000)
        let interval = null;
        if(props.isTimerActive === true && props.timerHolder === props.id) {
            interval = setInterval(() => {
                dispatch(
                    focusTimerActions.startTimer({
                        seconds: elapsedSeconds
                    })
                )
                props.setSeconds(props.used_seconds + elapsedSeconds);
            }, 1000);
        }
        if(props.isTimerActive === false && props.timerHolder === props.id) {
            console.log('Timer stopped');
            dispatch(
                focusTimerActions.stopTimer()
            )
            setStartTimeSetted(false);
        }
        return () => clearInterval(interval);
    }, [props, dispatch, startTime])

    // Used to update parent's used time
    /**
     * Why we need this?
     * const [seconds, setSeconds] = useState(props.daily_plan.seconds);
     * The initial state will only be set when first rendering the component DailyPlan.
     * After the child task stop the timer, although props.daily_plan.seconds already reflect
     * all tasks' most recent used seconds, state for seconds won't be updated.
     */
    useEffect(() => {
        if(props.isTimerActive === false && props.used_seconds !== props.seconds) {
            props.setSeconds(props.used_seconds);
        }
    })

    return (
        <div>
            {secondsToHMS(props.seconds)}
        </div>
    )
}

export default Timer;



/* ========== Learning ========== */
/* Timer/setInterval stops working when switching tabs */
// Reference: https://stackoverflow.com/questions/72433878/my-counter-stop-when-i-switch-tab-reactjs
// When the application's tab is inactive, most browsers will throttle tab activities to preserve resources.
// As a result, timer will stop working in this case