import React from 'react';
import { useState, useEffect } from 'react';
import classes from './TodayPlanSummary.module.css';

/* ========== import other libraries ========== */
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

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

    const untrackedTime = 24 * 60 * 60 - expectedTimeToday - 1 * 60 * 60 - 8 * 60 * 60 - 30 * 60; // 1 hour eating, 8 hours sleeping, 30 minutes spacing out

    return (
        <React.Fragment>
            <Row>
                <Col className={classes.first_column}>Total Planned Time:</Col>
                <Col>{secondsToHMS(expectedTimeToday)}</Col>
            </Row>
            <Row>
                <Col className={classes.first_column}>Remaining Planned Time:</Col>
                <Col>{secondsToHMS(remainingPlannedTime)}</Col>
            </Row>
            <Row>
                <Col className={classes.first_column}>Total Used Time:</Col>
                <Col>{secondsToHMS(props.used_time)}</Col>
            </Row>
            <Row>
                <Col className={classes.first_column}>Sleep in:</Col>
                <Col><span>{sleepCountdown}</span></Col>
            </Row>

            <Row className={classes.dividing_line}/>

            <Row>
                <Col className={classes.first_column}>Life Support:</Col>
                <Col>9:30</Col>
            </Row>
            <Row>
                <Col className={classes.first_column}><div className={classes.lifeSupportDetails}>Eating:</div></Col>
                <Col>1:00</Col>
            </Row>
            <Row>
                <Col className={classes.first_column}><div className={classes.lifeSupportDetails}>Sleeping:</div></Col>
                <Col>8:00</Col>
            </Row>
            <Row>
                <Col className={classes.first_column}><div className={classes.lifeSupportDetails}>Spacing Out:</div></Col>
                <Col>0:30</Col>
            </Row>
            <Row>
                <Col className={classes.first_column}>Untracked Time:</Col>
                <Col>{secondsToHMS(untrackedTime)}</Col>
            </Row>
        </React.Fragment>
        
    )
}

export default TodayPlanSummary;