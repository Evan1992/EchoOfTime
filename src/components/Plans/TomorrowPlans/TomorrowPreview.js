import React from 'react';

/* ========== import other libraries ========== */
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/esm/Container';

const TomorrowPreview = (props) => {
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

    let expectedTimeTomorrow = 0;
    let expectedTimeTomorrowForPriority1 = 0;
    let expectedTimeTomorrowForPriority2 = 0;
    let expectedTimeTomorrowForPriority3 = 0;
    for(const tomorrow_plan of props.tomorrow_plans) {
        expectedTimeTomorrow += tomorrow_plan.expected_hours * 60 * 60 + tomorrow_plan.expected_minutes * 60;
        if(tomorrow_plan.priority === 1) {
            expectedTimeTomorrowForPriority1 += tomorrow_plan.expected_hours * 60 * 60 + tomorrow_plan.expected_minutes * 60;
        } else if(tomorrow_plan.priority === 2) {
            expectedTimeTomorrowForPriority2 += tomorrow_plan.expected_hours * 60 * 60 + tomorrow_plan.expected_minutes * 60;
        } else if(tomorrow_plan.priority === 3) {
            expectedTimeTomorrowForPriority3 += tomorrow_plan.expected_hours * 60 * 60 + tomorrow_plan.expected_minutes * 60;
        }
    }

    return (
        <React.Fragment>
            <Container fluid>
                <Row>
                    <Col xs={2} />
                    <Col style={{ paddingLeft: 0 }}>
                        <h4>Tomorrow Preview</h4>
                    </Col>
                </Row>

                <Row>
                    <Col xs={2} />
                    <Col style={{ paddingLeft: 0 }}>Total Planned Time: {secondsToHMS(expectedTimeTomorrow)} </Col>
                </Row>
                <Row>
                    <Col xs={2} />
                    <Col style={{ paddingLeft: 0, color: '#ff6b6b'}}>1: {secondsToHMS(expectedTimeTomorrowForPriority1)} </Col>
                </Row>
                <Row>
                    <Col xs={2} />
                    <Col style={{ paddingLeft: 0, color: '#ffb800' }}>2: {secondsToHMS(expectedTimeTomorrowForPriority2)} </Col>
                </Row>
                <Row>
                    <Col xs={2} />
                    <Col style={{ paddingLeft: 0, color: '#51cf66' }}>3: {secondsToHMS(expectedTimeTomorrowForPriority3)} </Col>
                </Row>
            </Container>
        </React.Fragment>
    )
}

export default TomorrowPreview