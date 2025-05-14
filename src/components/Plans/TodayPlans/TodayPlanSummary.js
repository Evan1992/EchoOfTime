import React from 'react';

/* ========== import other libraries ========== */
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/esm/Container';


const TodayPlanSummary = (props) => {
    let expectedTimeToday = 0;
    let remainingPlannedTime = 0;
    if (props.today_plans !== undefined) {
        for(const today_plan of props.today_plans) {
            expectedTimeToday += today_plan.expected_hours * 60 * 60 + today_plan.expected_minutes * 60
            remainingPlannedTime += today_plan.expected_hours * 60 * 60 + today_plan.expected_minutes * 60;
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
            <Container fluid>
                <Row>
                    <Col xs={1} />
                    {/* Total Planned Time is: Time for active plans of today + Time for finished plans of today  */}
                    <Col>Total Planned Time: {secondsToHMS(expectedTimeToday)} </Col>
                </Row>
                <Row>
                    <Col xs={1} />
                    {/* Remaining Time is: Time for active plans of today */}
                    <Col>Remaining Time: {secondsToHMS(remainingPlannedTime)}</Col>
                </Row>
                <Row>
                    <Col xs={1} />
                    {/* Total Used Time is: Time actually used for plans of today */}
                    <Col>Total Used Time: {secondsToHMS(props.used_time)}</Col>
                </Row>
            </Container>
        </React.Fragment>
    )
}

export default TodayPlanSummary