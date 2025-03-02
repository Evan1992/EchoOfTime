import React, { useState, useCallback, useEffect } from 'react';
import { useTimer } from "react-use-precision-timer";

const TimerForFocus = (props) => {
    const [seconds, setSeconds] = useState(0);

    const callback = useCallback(() => setSeconds((prevSeconds) => prevSeconds + 1), []);
    // The callback will be called every 1000 milliseconds.
    const timer = useTimer({ delay: 1000 }, callback);

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

    useEffect(() => {
        if(props.isTimerActiveGlobal) {
            timer.start();
        } else {
            timer.stop();
            setSeconds(0);
        }
    }, [props, timer])

    return (
        <div>
            {secondsToHMS(seconds)}
        </div>
    )
}

export default TimerForFocus;