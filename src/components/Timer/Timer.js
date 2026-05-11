import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const Timer = (props) => {
    const focusTimer = useSelector((state) => state.focusTimer);
    const isActiveForThisPlan = focusTimer.isTimerActive && focusTimer.timerHolder === props.id;
    const displaySeconds = isActiveForThisPlan ? focusTimer.focusTime : props.seconds;

    const formatToTwoDigits = (n) => n < 10 ? `0${n}` : `${n}`;

    const secondsToHMS = (seconds) => {
        const hour   = formatToTwoDigits((seconds / 3600) >> 0);
        const minute = formatToTwoDigits(((seconds % 3600) / 60) >> 0);
        const second = formatToTwoDigits(seconds % 60);
        return `${hour}:${minute}:${second}`;
    };

    // Sync parent's seconds state when timer stops and used_seconds changed (e.g., child task ran)
    useEffect(() => {
        if (!focusTimer.isTimerActive && props.used_seconds !== props.seconds) {
            props.setSeconds(props.used_seconds);
        }
    });

    return (
        <div>
            {secondsToHMS(displaySeconds)}
        </div>
    );
}

export default Timer;
