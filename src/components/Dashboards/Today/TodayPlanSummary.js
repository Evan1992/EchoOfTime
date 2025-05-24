import React from 'react';
import { useState, useEffect } from 'react';
import classes from './TodayPlanSummary.module.css';

const TodayPlanSummary = (props) => {
    let expectedTimeToday = 0;
    let remainingPlannedTime = 0;

    // --- Countdown to 12:30am ---
    const [sleepCountdown, setSleepCountdown] = useState('');
    useEffect(() => {
        const updateCountdown = () => {
            const now = new Date();
            // Set target to next day's 00:30am
            const target = new Date(now);
            target.setDate(now.getHours() < 0 || (now.getHours() === 0 && now.getMinutes() < 30) ? now.getDate() : now.getDate() + 1);
            target.setHours(0, 30, 0, 0);

            let diff = Math.floor((target - now) / 1000);
            if (diff < 0) diff += 24 * 3600; // If negative, add 24 hours

            // Only show hours and minutes
            let hour  = (diff / 3600) >> 0;
            let minute  = ((diff % 3600) / 60) >> 0;
            const formatToTwoDigits = (n) => (n < 10 ? `0${n}` : `${n}`);
            setSleepCountdown(`${formatToTwoDigits(hour)}:${formatToTwoDigits(minute)}`);
        };

        updateCountdown();
        const timer = setInterval(updateCountdown, 60000);
        return () => clearInterval(timer);
    }, []);

    if (props.today_plans !== undefined) {
        for(const today_plan of props.today_plans) {
            expectedTimeToday += today_plan.expected_hours * 60 * 60 + today_plan.expected_minutes * 60
            if (today_plan.completed === false) {
                remainingPlannedTime += today_plan.expected_hours * 60 * 60 + today_plan.expected_minutes * 60;
            }
        }
    }

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

    return (
        <React.Fragment>
            <div>Total Planned Time: {secondsToHMS(expectedTimeToday)}</div>
            <div>Remaining Planned Time: {secondsToHMS(remainingPlannedTime)}</div>
            <div>Total Used Time: {secondsToHMS(props.used_time)}</div>
            <div>Sleep in: <span>{sleepCountdown}</span></div>
            <div>Life Support:
                <div className={classes.lifeSupportDetails}>Eating: 1:00</div>
                <div className={classes.lifeSupportDetails}>Sleeping: 8:00</div>
                <div className={classes.lifeSupportDetails}>Space Out: 0:30</div>
            </div>
        </React.Fragment>
        
    )
}

export default TodayPlanSummary;