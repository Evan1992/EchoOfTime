import React from 'react';
import { useSelector } from 'react-redux';

/* ========== import other libraries ========== */
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/esm/Container';

/* ========== import React components ========== */
import NewDailyPlan from '../DailyPlans/NewDailyPlan';
import DailyPlan from '../DailyPlans/DailyPlan';


const TodoEverydayPlans = (props) => {
    const todoEverydayPlans = useSelector((state) => state.activePlan.short_term_plan.todo_everyday_plans);

    return (
        <React.Fragment>
            <Container fluid>
                <Row>
                    <Col xs={2} />
                    <Col style={{ paddingLeft: 0 }}>
                        <h4>Todo Everyday</h4>
                    </Col>
                </Row>

                {
                    todoEverydayPlans &&
                    todoEverydayPlans.map((dailyPlan, index) => {
                        let show_children = false;
                        if(dailyPlan.has_children) {
                            if(index+1 < todoEverydayPlans.length && todoEverydayPlans[index+1].show_plan) {
                                show_children = true;
                            }
                        }
                        if(dailyPlan.show_plan) {
                            return <DailyPlan
                                key={dailyPlan.id}
                                id={dailyPlan.id}
                                daily_plan={dailyPlan}
                                rank={dailyPlan.rank}
                                show_children={show_children}
                                isTodoEveryPlan={true}
                                isTimerActive={props.isTimerActive}
                                setIsTimerActive={props.setIsTimerActive}
                                timerHolder={props.timerHolder}
                                setTimerHolder={props.setTimerHolder}
                                highlight={props.highlight}
                                setHighlight={props.setHighlight}
                            />
                        }

                    })
                }

                <Row>
                    <Col xs={2} />
                    <Col style={{ paddingLeft: 0 }}>
                        <NewDailyPlan
                            isTodoEveryPlan={true}
                        />
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    )
}

export default TodoEverydayPlans;