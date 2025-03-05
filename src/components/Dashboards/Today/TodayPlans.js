import React from 'react';

/* ========== import other libraries ========== */
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/esm/Container';

const TodayPlans = () => {
    return (
        <React.Fragment>
            <Container fluid>
                <Row>
                    <Col xs={1} />
                    <Col>
                        <h4>Todo Today</h4>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    )
}

export default TodayPlans
