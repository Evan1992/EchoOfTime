import React from 'react';

/* ========== import React components ========== */
import TodayPlan from './TodayPlan';

/* ========== import other libraries ========== */
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/esm/Container';

/* ========== import css ========== */
import classes from './TodayPlans.module.css';

const TodayPlans = (props) => {
    return (
        <React.Fragment>
            <h4>Todo Today</h4>
            <Container fluid className={classes.container}>
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

