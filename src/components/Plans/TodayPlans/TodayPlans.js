import React from 'react';

/* ========== import React components ========== */
import TodayPlan from './TodayPlan';

/* ========== import other libraries ========== */
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/esm/Container';

const TodayPlans = (props) => {
    return (
        <React.Fragment>
            <Container fluid>
                <Row>
                    <Col xs={1} />
                    <Col>
                        <h4>Todo Today</h4>
                    </Col>
                </Row>
                {
                    props.today_plans.map((plan, index) => {
                        return <TodayPlan
                            key={index}
                            plan={plan}
                        />
                    })
                }
            </Container>
        </React.Fragment>
    )
}

export default TodayPlans

