import React from 'react';
import { useSelector } from 'react-redux';

/* ========== import React components ========== */
import TodayPlan from './TodayPlan';

/* ========== import other libraries ========== */
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/esm/Container';
import { isToday } from '../../../utilities';

const TodayPlans = (props) => {
    const plan = useSelector((state) => state.activePlan);
    const today_plans = []
    if(plan.short_term_plan.daily_plans !== undefined) {
        for(const daily_plan of plan.short_term_plan.daily_plans) {
            if(isToday(daily_plan.date)) {
                today_plans.push(daily_plan)
            }
        }
    }

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
                    today_plans.map((today_plan) => {
                        return <TodayPlan
                            key={today_plan.id}
                            plan={today_plan}
                        />
                    })
                }
            </Container>
        </React.Fragment>
    )
}

export default TodayPlans

