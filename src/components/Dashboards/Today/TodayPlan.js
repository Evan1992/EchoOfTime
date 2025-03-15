import React from 'react';

/* ========== import other libraries ========== */
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const TodayPlan = (props) => {

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
            <Row>
                <Col className="p-0">
                    <div>{props.plan.title}</div>
                </Col>
                <Col className="p-0">
                    <div>{props.plan.expected_hours}:{props.plan.expected_minutes}</div>
                </Col>
                <Col className="p-0">
                    <div>{secondsToHMS(props.plan.seconds)}</div>
                </Col>
            </Row>
        </React.Fragment>
    )
}

export default TodayPlan