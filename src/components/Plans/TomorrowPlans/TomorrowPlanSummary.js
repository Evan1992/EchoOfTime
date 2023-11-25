import React from 'react';

/* ========== import other libraries ========== */
import { isTomorrow } from '../../../utilities';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/esm/Container';

const TomorrowPlanSummary = (props) => {
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

    const calTotalPlannedTime = (plans) => {
        let expectedTimeSum = 0
        for (let json_object of plans.values()){
            const is_tomorrow = isTomorrow(json_object.date)
            if(is_tomorrow) {
                expectedTimeSum += json_object.expected_hours * 60 * 60 + json_object.expected_minutes * 60
            }
        }
        return secondsToHMS(expectedTimeSum)
    }

    return (
        <React.Fragment>
            <Container fluid>
                <Row>
                    <Col xs={1} />
                    <Col>
                        <h4>What's Tomorrow Like</h4>
                    </Col>
                </Row>
                <Row>
                    <Col xs={1} />
                    {/* Total Planned Time is: Time for active plans of today + Time for finished plans of today  */}
                    <Col>Total Planned Time: {calTotalPlannedTime(props.all_plans)} </Col>
                </Row>
            </Container>
        </React.Fragment>
    )
}

export default TomorrowPlanSummary