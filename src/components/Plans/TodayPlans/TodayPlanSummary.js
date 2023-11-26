import React from 'react';

/* ========== import other libraries ========== */
import { isToday } from '../../../utilities';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/esm/Container';

const TodayPlanSummary = (props) => {
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

    const calTotalPlannedTime = (seconds) => {
        return secondsToHMS(seconds);
    }

    const calRemainingTime = (plans) => {
        let expectedTimeSum = 0
        for (let json_object of plans.values()){
            const is_today = isToday(json_object.date)
            if(is_today) {
                expectedTimeSum += json_object.expected_hours * 60 * 60 + json_object.expected_minutes * 60
            }
        }
        return secondsToHMS(expectedTimeSum)
    }

    const calTotalUsedTime = (seconds) => {
        return secondsToHMS(seconds);
    }

    return (
        <React.Fragment>
            <Container fluid>
                <Row>
                    <Col xs={1} />
                    <Col>
                        <h4>What's Today Like</h4>
                    </Col>
                </Row>
                <Row>
                    <Col xs={1} />
                    {/* Total Planned Time is: Time for active plans of today + Time for finished plans of today  */}
                    <Col>Total Planned Time: {calTotalPlannedTime(props.total_planned_time)} </Col>
                </Row>
                <Row>
                    <Col xs={1} />
                    {/* Remaining Time is: Time for active plans of today */}
                    <Col>Remaining Time: {calRemainingTime(props.all_plans)}</Col>
                </Row>
                <Row>
                    <Col xs={1} />
                    {/* Total Used Time is: Time actually used for plans of today */}
                    <Col>Total Used Time: {calTotalUsedTime(props.used_time)}</Col>
                </Row>
            </Container>
        </React.Fragment>
    )
}

export default TodayPlanSummary