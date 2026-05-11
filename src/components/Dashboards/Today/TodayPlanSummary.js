import React from 'react';
import { useState, useEffect } from 'react';
import classes from './TodayPlanSummary.module.css';

/* ========== import React components ========== */
import ProgressStatsPieChart from './ProgressStatsPieChart';
import UsedTimePieChart from './UsedTimePieChart';

/* ========== import other libraries ========== */
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


const EATING_TIME_SECONDS = 1 * 60 * 60;
const SLEEPING_TIME_SECONDS = 8 * 60 * 60;
const SPACING_OUT_TIME_SECONDS = 30 * 60;
const DAY_SECONDS = 24 * 60 * 60;

const TodayPlanSummary = (props) => {
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
            setSleepCountdown(`${formatToTwoDigits(hour)}:${formatToTwoDigits(minute)}:00`);
        };

        updateCountdown();
        const timer = setInterval(updateCountdown, 60000);
        return () => clearInterval(timer);
    }, []);

    let expectedTimeToday = 0;
    let expectedTimeTodayForPriority1 = 0;
    let expectedTimeTodayForPriority2 = 0;
    let expectedTimeTodayForPriority3 = 0;
    let remainingPlannedTime = 0;
    if (props.today_plans !== undefined) {
        for(const today_plan of props.today_plans) {
            expectedTimeToday += today_plan.expected_hours * 60 * 60 + today_plan.expected_minutes * 60
            if (today_plan.completed === false) {
                remainingPlannedTime += today_plan.expected_hours * 60 * 60 + today_plan.expected_minutes * 60;
            }

            if(today_plan.priority === 1) {
                expectedTimeTodayForPriority1 += today_plan.expected_hours * 60 * 60 + today_plan.expected_minutes * 60;
            } else if(today_plan.priority === 2) {
                expectedTimeTodayForPriority2 += today_plan.expected_hours * 60 * 60 + today_plan.expected_minutes * 60;
            } else if(today_plan.priority === 3) {
                expectedTimeTodayForPriority3 += today_plan.expected_hours * 60 * 60 + today_plan.expected_minutes * 60;
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

    const untrackedTime = Math.max(0, DAY_SECONDS - expectedTimeToday - EATING_TIME_SECONDS - SLEEPING_TIME_SECONDS - SPACING_OUT_TIME_SECONDS);

    // --- Used time grouped by root parent plan ---
    const usedTimeSegments = (() => {
        if (!props.today_plans) return [];
        const idPlanMap = new Map();
        for (const p of (props.sprint_plans || [])) idPlanMap.set(p.id, p);
        for (const p of props.today_plans) idPlanMap.set(p.id, p);

        const findRoot = (plan) => {
            if (!plan.parent_id || !idPlanMap.has(plan.parent_id)) return plan;
            return findRoot(idPlanMap.get(plan.parent_id));
        };

        const rootMap = new Map(); // rootId -> {title, seconds}
        for (const p of props.today_plans) {
            const root = findRoot(p);
            if (!rootMap.has(root.id)) rootMap.set(root.id, { title: root.title, seconds: 0 });
            rootMap.get(root.id).seconds += (p.seconds || 0);
        }
        return Array.from(rootMap.values());
    })();

    return (
        <React.Fragment>
            <Row>
                <Col className={classes.first_column}>Total Planned Time:</Col>
                <Col>{secondsToHMS(expectedTimeToday)}</Col>
            </Row>
            <Row>
                <Col className={classes.first_column} style={{ color: '#ff6b6b'}}><div className={classes.priority}>1:</div></Col>
                <Col style={{ color: '#ff6b6b'}}>{secondsToHMS(expectedTimeTodayForPriority1)}</Col>
            </Row>
            <Row>
                <Col className={classes.first_column} style={{ color: '#ffb800' }}><div className={classes.priority}>2:</div></Col>
                <Col style={{ color: '#ffb800' }}>{secondsToHMS(expectedTimeTodayForPriority2)}</Col>
            </Row>
            <Row>
                <Col className={classes.first_column} style={{ color: '#51cf66' }}><div className={classes.priority}>3:</div></Col>
                <Col style={{ color: '#51cf66' }}>{secondsToHMS(expectedTimeTodayForPriority3)}</Col>
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
                <Col>9:30:00</Col>
            </Row>
            <Row>
                <Col className={classes.first_column}><div className={classes.lifeSupportDetails}>Eating:</div></Col>
                <Col>1:00:00</Col>
            </Row>
            <Row>
                <Col className={classes.first_column}><div className={classes.lifeSupportDetails}>Sleeping:</div></Col>
                <Col>8:00:00</Col>
            </Row>
            <Row>
                <Col className={classes.first_column}><div className={classes.lifeSupportDetails}>Spacing Out:</div></Col>
                <Col>0:30:00</Col>
            </Row>
            <Row>
                <Col className={classes.first_column}>Untracked Time:</Col>
                <Col>{secondsToHMS(untrackedTime)}</Col>
            </Row>

            <Row className={classes.dividing_line} />

            <Row><h4>Progress Stats</h4></Row>
            <Row className={classes.pie_chart_row}>
                <ProgressStatsPieChart
                    expectedTimeToday={expectedTimeToday}
                    remainingPlannedTime={remainingPlannedTime}
                />
            </Row>
            <Row><h4>Used Time</h4></Row>
            <Row className={classes.pie_chart_row}>
                <UsedTimePieChart segments={usedTimeSegments} />
            </Row>
        </React.Fragment>
        
    )
}

export default TodayPlanSummary;