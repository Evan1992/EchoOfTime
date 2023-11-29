import React, { useState, useEffect } from 'react';

const TimerForFocus = (props) => {
    const [seconds, setSeconds] = useState(0)

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
        let interval = null;
        if(props.isClockActiveGlobal) {
            interval = setInterval(() => {
                setSeconds((preSeconds) => preSeconds + 1);
            }, 1000);
        } else {
            setSeconds(0);
        }
        return () => clearInterval(interval);
    }, [props])

    return (
        <div>
            {secondsToHMS(seconds)}
        </div>
    )
}

export default TimerForFocus;