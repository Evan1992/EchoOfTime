import React from 'react';

/* ========== import other libraries ========== */
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/esm/Container';

/* ========== import react components ========== */
import TimerForFocus from '../Timer/TimerForFocus';

const Focus = (props) => {
    return(
        <React.Fragment>
            <Container fluid>
                <Row>
                    <Col xs={1} />
                    <Col>
                        <h4>Focus</h4>
                    </Col>
                </Row>

                <Row>
                    <Col xs={1} />

                    <Col>
                        <TimerForFocus isClockActiveGlobal={props.isClockActiveGlobal} />
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    )
}

export default Focus;