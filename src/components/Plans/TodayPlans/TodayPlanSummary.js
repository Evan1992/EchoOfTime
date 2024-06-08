import React from 'react';
import { useSelector } from 'react-redux';

/* ========== import other libraries ========== */
import { isToday } from '../../../utilities';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/esm/Container';


const TodayPlanSummary = () => {
    const plan = useSelector((state) => state.activePlan);

    let expectedHoursToday = localStorage.getItem('expectedHoursChecked') === null ? 0 : localStorage.getItem('expectedHoursChecked')
    let expectedMinutesToday = localStorage.getItem('expectedMinutesChecked') === null ? 0 : localStorage.getItem('expectedMinutesChecked')
    let usedTime = localStorage.getItem('usedTime') === null ? 0 : localStorage.getItem('usedTime')
    let remainingTime = 0;
    if(plan.short_term_plan.daily_plans !== undefined) {
        for(const daily_plan of plan.short_term_plan.daily_plans) {
            if(isToday(daily_plan.date)) {
                expectedHoursToday += daily_plan.expected_hours;
                expectedMinutesToday += daily_plan.expected_minutes;
                remainingTime += daily_plan.expected_hours * 60 * 60 + daily_plan.expected_minutes * 60;
                usedTime += daily_plan.seconds;
            }
        }
    }
    const expectedTimeToday = expectedHoursToday * 60 * 60 + expectedMinutesToday * 60

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
            <Container fluid>
                <Row>
                    <Col xs={1} />
                    {/* Total Planned Time is: Time for active plans of today + Time for finished plans of today  */}
                    <Col>Total Planned Time: {secondsToHMS(expectedTimeToday)} </Col>
                </Row>
                <Row>
                    <Col xs={1} />
                    {/* Remaining Time is: Time for active plans of today */}
                    <Col>Remaining Time: {secondsToHMS(remainingTime)}</Col>
                </Row>
                <Row>
                    <Col xs={1} />
                    {/* Total Used Time is: Time actually used for plans of today */}
                    <Col>Total Used Time: {secondsToHMS(usedTime)}</Col>
                </Row>
            </Container>
        </React.Fragment>
    )
}

export default TodayPlanSummary