import React, { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/* ========== import other libraries ========== */
import { getTodayDateString } from '../../../utilities';
import { sendPlanData } from '../../../store/slices/active-plan-actions';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/esm/Container';

/* ========== import React components ========== */
import AuthContext from '../../../store/auth-context';
import NewDailyPlan from '../DailyPlans/NewDailyPlan';
import DailyPlan from '../DailyPlans/DailyPlan';


const TodoEverydayPlans = (props) => {
    const authCtx = useContext(AuthContext);
    const plan = useSelector((state) => state.activePlan);
    const [planDeleted, setPlanDeleted] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if(planDeleted === true) {
            // No need to do sendDailyPlanData as sendPlanData will update the parent object
            // dispatch(sendDailyPlanData(authCtx, plan))
            dispatch(sendPlanData(authCtx, plan))
            setPlanDeleted(false);
        }
    }, [dispatch, authCtx, plan, planDeleted])

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
                    plan.short_term_plan.todo_everyday.todo_everyday_plans &&
                    plan.short_term_plan.todo_everyday.todo_everyday_plans.map((dailyPlan, index) => {
                        let show_children = false;
                        if(dailyPlan.has_children) {
                            if(index+1 < plan.short_term_plan.todo_everyday.todo_everyday_plans.length &&
                                plan.short_term_plan.todo_everyday.todo_everyday_plans[index+1].show_plan) {
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
                                set_plan_deleted={setPlanDeleted}
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
                            date={getTodayDateString()}
                        />
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    )
}

export default TodoEverydayPlans;