import React from 'react';
import { useState } from 'react';
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
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [timerHolder, setTimerHolder] = useState(null);
    const [highlight, setHighlight] = useState(null);

    const rootPlans = []
    const planTree = new Map();
    const buildPlanTree = () => {
        for(const [index, daily_plan] of plan.short_term_plan.daily_plans.entries()) {
            if (daily_plan.parent_id === undefined) {
                rootPlans.push([daily_plan, index])
            }

            if (daily_plan.has_children) {
                planTree.set(daily_plan.id, []);
            }

            if (daily_plan.parent_id !== undefined) {
                planTree.get(daily_plan.parent_id).push([daily_plan, index]);
            }
        }
    }

    // DFS algorithm to add all parent plans if date for current plan is today
    const isAddToTodays = Array(plan.short_term_plan.daily_plans.length).fill(false);
    const mutateIsAddToTodays = (cur_plan, cur_index) => {
        console.log(cur_index)
        let is_today = isToday(cur_plan.date)
        if (is_today === true) {
            isAddToTodays[cur_index] = true;
        }

        // base case
        if (cur_plan.has_children === false) {
            return is_today
        }

        // general case
        let any_child_is_today = false;
        for (const plan of planTree.get(cur_plan.id)) {
            let result = mutateIsAddToTodays(plan[0], plan[1])
            if (result === true) {
                isAddToTodays[cur_index] = true;
            }
            any_child_is_today = any_child_is_today || result;
        }
        return any_child_is_today;
    }

    const todayPlans = [];
    if (plan.short_term_plan.daily_plans !== undefined) {
        buildPlanTree();
        for (const rootPlan of rootPlans) {
            mutateIsAddToTodays(rootPlan[0], rootPlan[1])
        }

        for(const [index, daily_plan] of plan.short_term_plan.daily_plans.entries()) {
            if (isAddToTodays[index]) {
                todayPlans.push([daily_plan, index]);
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
                                    let show_children = false;
                                    // today_plan[0] is the daily plan, today_plan[1] is the index of the daily plan
                                    if(today_plan[0].has_children) {
                                        const index = today_plan[1];
                                        if(index+1 < plan.short_term_plan.daily_plans.length && plan.short_term_plan.daily_plans[index+1].show_plan) {
                                            show_children = true;
                                        }
                                    }
                                    if(today_plan[0].show_plan) {
                                        return <TodayPlan
                                            key={today_plan[0].id}
                                            index={today_plan[1]}
                                            plan={plan}
                                            today_plan={today_plan[0]}
                                            show_children={show_children}
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
