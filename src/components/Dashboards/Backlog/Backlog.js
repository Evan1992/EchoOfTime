/* ========== import React and React hooks ========== */
import React, { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/* ========== import React components ========== */
import NewDailyPlan from '../../Plans/DailyPlans/NewDailyPlan';
import DailyPlan from '../../Plans/DailyPlans/DailyPlan';
import AuthContext from '../../../store/auth-context';
import TomorrowPreview from './TomorrowPreview';

/* ========== import other libraries ========== */
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { isTomorrow } from '../../../utilities';
import { sendPlanData } from '../../../store/slices/active-plan-actions';

/* ========== import css ========== */
import 'bootstrap/dist/css/bootstrap.min.css';
import classes from './Backlog.module.css';


const Backlog = () => {
    const authCtx = useContext(AuthContext);
    const [planDeleted, setPlanDeleted] = useState(false);
    // Only one timer for a task can be active at a time
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [timerHolder, setTimerHolder] = useState(null);
    const [highlight, setHighlight] = useState(null);
    const dispatch = useDispatch();
    const plan = useSelector((state) => state.activePlan);

    const tomorrowPlans = []
    if(plan.short_term_plan.daily_plans !== undefined) {
        for(const daily_plan of plan.short_term_plan.daily_plans) {
            if(isTomorrow(daily_plan.date)) {
                tomorrowPlans.push(daily_plan)
            }
        }
    }

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
            {/* Component for all active plans */}
            <div className={classes.plans}>
                <Container>
                    {
                        plan.short_term_plan.daily_plans &&
                        plan.short_term_plan.daily_plans.map((dailyPlan, index) => {
                            let show_children = false;
                            if(dailyPlan.has_children) {
                                if(index+1 < plan.short_term_plan.daily_plans.length && plan.short_term_plan.daily_plans[index+1].show_plan) {
                                    show_children = true;
                                }
                            }
                            if(dailyPlan.show_plan) {
                                return <DailyPlan
                                    key={dailyPlan.id}
                                    id={dailyPlan.id}
                                    plan={plan}
                                    daily_plan={dailyPlan}
                                    rank={dailyPlan.rank}
                                    show_children={show_children}
                                    set_plan_deleted={setPlanDeleted}
                                    isTimerActive={isTimerActive}
                                    setIsTimerActive={setIsTimerActive}
                                    timerHolder={timerHolder}
                                    setTimerHolder={setTimerHolder}
                                    highlight={highlight}
                                    setHighlight={setHighlight}
                                />
                            }
                            return <div key={dailyPlan.id} />
                        })
                    }
                    <Row>
                        <Col xs={2} />
                        <NewDailyPlan />
                    </Row>

                    {/* Separation between backlog plans and TomorrowPreview */}
                    <div style={{height: "25px"}} />

                    <TomorrowPreview tomorrow_plans={tomorrowPlans} />
                </Container>
            </div>
        </React.Fragment>
    )
}

export default Backlog
