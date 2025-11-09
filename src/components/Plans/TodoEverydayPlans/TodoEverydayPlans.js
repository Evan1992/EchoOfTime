import React from 'react';

/* ========== import other libraries ========== */
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/esm/Container';

/* ========== import React components ========== */
import NewDailyPlan from '../DailyPlans/NewDailyPlan';


const TodoEverydayPlans = () => {
    return (
        <React.Fragment>
            <Container fluid>
                <Row>
                    <Col xs={2} />
                    <Col style={{ paddingLeft: 0 }}>
                        <h4>Todo Everyday</h4>
                    </Col>
                </Row>
                <Row>
                    <Col xs={2} />
                    <NewDailyPlan />
                </Row>
            </Container>
        </React.Fragment>
    )
}

export default TodoEverydayPlans;