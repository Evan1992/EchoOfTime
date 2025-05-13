import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';

/* ========== import React components ========== */
import Focus from './Focus';
import TodayPlan from './TodayPlan';
import TodayPlanSummary from './TodayPlanSummary';
import NewDailyPlan from '../../Plans/DailyPlans/NewDailyPlan';
import AuthContext from '../../../store/auth-context';

/* ========== import other libraries ========== */
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/esm/Container';
import { sendDailyPlanData, sendPlanData, updateToday } from '../../../store/slices/active-plan-actions';

/* ========== import css ========== */
import classes from './TodayPlans.module.css';

const TodayPlans = () => {
    const authCtx = useContext(AuthContext);
    const plan = useSelector((state) => state.activePlan);
    const [planRemoved, setPlanRemoved] = useState(false);
    const [planDeleted, setPlanDeleted] = useState(false);
    // Only one timer for a task can be active at a time
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [timerHolder, setTimerHolder] = useState(null);
    const [highlight, setHighlight] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if(planRemoved) {
            dispatch(sendDailyPlanData(authCtx.userID, plan))
            dispatch(updateToday(authCtx.userID,
                plan.today.date,
                plan.today.today_plans,
                plan.today.used_time))
            setPlanRemoved(false);
        }
        if(planDeleted === true) {
            // No need to do sendDailyPlanData as sendPlanData will update the parent object
            // dispatch(sendDailyPlanData(authCtx.userID, plan))
            dispatch(sendPlanData(authCtx.userID, plan))
            setPlanDeleted(false);
        }
    }, [dispatch, authCtx.userID, plan, planRemoved, planDeleted])

    const id_plan_map = new Map();
    for (const daily_plan of plan.short_term_plan.daily_plans) {
        id_plan_map.set(daily_plan.id, daily_plan);
    }
    if (plan.today.today_plans !== undefined) {
        for (const today_plan of plan.today.today_plans) {
            if (!id_plan_map.has(today_plan.id)) {
                id_plan_map.set(today_plan.id, today_plan);
            }
        }
    }

    const findAllParentPlans = (today_plan, parent_plans) => {
        parent_plans.push(today_plan.id);
        if (today_plan.parent_id !== undefined) {
            findAllParentPlans(id_plan_map.get(today_plan.parent_id), parent_plans);
        }
        return parent_plans;
    }

    const planTree = new Map();
    const rootPlans = new Set();
    if (plan.today.today_plans !== undefined) {
        for (const today_plan of plan.today.today_plans) {
            let parent_plan_ids = findAllParentPlans(today_plan, []); // parent_plan_ids includes current plan and its parent plans

            for(let i = 0; i < parent_plan_ids.length; i++) {
                const parent_plan_id = parent_plan_ids[i];
                if (i === parent_plan_ids.length - 1) {
                    rootPlans.add(parent_plan_id);
                }

                if (i > 0) {
                    if (!planTree.has(parent_plan_id)) {
                        planTree.set(parent_plan_id, new Set([parent_plan_ids[i - 1]]));
                    } else {
                        planTree.get(parent_plan_id).add(parent_plan_ids[i - 1]);
                    }
                } else {
                    if (!planTree.has(parent_plan_id)) {
                        planTree.set(parent_plan_id, new Set());
                    }
                }
            }
        }
    }

    const todayPlansForDisplay = [];
    for (const root_plan of rootPlans) {
        todayPlansForDisplay.push(id_plan_map.get(root_plan));
        let bfs_queue = [];
        for (const child_plan of planTree.get(root_plan)) {
            bfs_queue.push(child_plan);
        }
        while (bfs_queue.length > 0) {
            const cur_plan = bfs_queue.shift();
            todayPlansForDisplay.push(id_plan_map.get(cur_plan));
            for (const child_plan of planTree.get(cur_plan)) {
                bfs_queue.push(child_plan);
            }
        }
    }

    const getTodayDateString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
        const day = today.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <React.Fragment>
            <Container className={classes.container}>
                <Row>
                    {/* <Col> has padding by default, use Bootstrap utility classes for no padding */}
                    <Col xs={8} className="p-0">
                        <Container className={classes.tasks}>
                            {
                                todayPlansForDisplay.map((today_plan, index) => {
                                    let show_children = false;
                                    if(today_plan.has_children) {
                                        if(index+1 < todayPlansForDisplay.length && todayPlansForDisplay[index+1].show_plan) {
                                            show_children = true;
                                        }
                                    }
                                    if(today_plan.show_plan) {
                                        return <TodayPlan
                                            key={today_plan.id}
                                            plan={plan}
                                            today_plan={today_plan}
                                            show_children={show_children}
                                            set_plan_deleted={setPlanDeleted}
                                            set_plan_removed={setPlanRemoved}
                                            isTimerActive={isTimerActive}
                                            setIsTimerActive={setIsTimerActive}
                                            timerHolder={timerHolder}
                                            setTimerHolder={setTimerHolder}
                                            highlight={highlight}
                                            setHighlight={setHighlight}
                                        />
                                    }
                                    // Explicitly return null if the condition is not met to avoid warning
                                    // "Array.prototype.map() expects a value to be returned at the end of arrow function"
                                    return null;
                                })
                            }

                            <NewDailyPlan
                                date={getTodayDateString()}
                            />
                        </Container>
                    </Col>
                    <Col xs={4} className="p-0">
                        <Container>
                            <Row>
                                <Focus />
                            </Row>
                            <Row>
                                <TodayPlanSummary
                                    today_plans={plan.today.today_plans}
                                    used_time={plan.today.used_time}
                                    expected_time_checked_today={plan.checked_tasks_today.expected_time}
                                />
                            </Row>
                        </Container>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    )
}

export default TodayPlans
