import React from 'react';
import { useSelector } from 'react-redux';

/* ========== import React components ========== */
import TodayPlan from './TodayPlan';

/* ========== import other libraries ========== */
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/esm/Container';
import { isToday } from '../../../utilities';

/* ========== import css ========== */
import classes from './TodayPlans.module.css';

const TodayPlans = () => {
    const plan = useSelector((state) => state.activePlan);

    const todayPlans = [];
    if(plan.short_term_plan.daily_plans !== undefined) {
        for(const daily_plan of plan.short_term_plan.daily_plans) {
            if(isToday(daily_plan.date)) {
                todayPlans.push(daily_plan);
            }
        }
    }

    return (
        <React.Fragment>
            <Container className={classes.container}>
                <Row>
                    {/* <Col> has padding by default, use Bootstrap utility classes for no padding */}
                    <Col xs={8} className="p-0">
                        <Container className={classes.tasks}>
                            {
                                todayPlans.map((today_plan) => {
                                    return <TodayPlan
                                        key={today_plan.id}
                                        plan={today_plan}
                                    />
                                })
                            }
                        </Container>
                    </Col>
                    <Col xs={4} className="p-0">
                        <Container>
                            <Row>
                                <Col>
                                    <h4>Placeholder</h4>
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    )
}

export default TodayPlans
