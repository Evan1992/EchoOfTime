import React from 'react';
import { useState, useEffect, useContext, useMemo, useCallback } from 'react';
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
import { isToday } from '../../../utilities';
import { sendDailyPlanData, sendPlanData, updateToday, fetchPlanData, refreshToday } from '../../../store/slices/active-plan-actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

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
    const [fetched, setFetched] = useState(false);
    const [filterOptionsVisible, setFilterOptionsVisible] = useState(false);
    const [filter, setFilter] = useState("All tasks");
    const dispatch = useDispatch();

    // Get the data from database as soon as user visit Today page
    useEffect(() => {
        // Check if the plan is already fetched
        if (plan.title === "") {
            dispatch(fetchPlanData(authCtx));
            setFetched(true);
        }
    }, [plan, authCtx, dispatch])

    // Update today if date fetched from database is not today
    useEffect(() => {
        if(fetched && plan.today.date !== "" && !isToday(plan.today.date)) {
            let new_today_plans = []
            for (const daily_plan of plan.short_term_plan.daily_plans) {
                if(isToday(daily_plan.date)) {
                    new_today_plans.push(daily_plan);
                }
            }
            dispatch(refreshToday(authCtx, new_today_plans));
        }
    }, [authCtx, dispatch, fetched, plan])

    useEffect(() => {
        if(planRemoved) {
            dispatch(sendDailyPlanData(authCtx, plan))
            dispatch(updateToday(authCtx,
                plan.today.date,
                plan.today.today_plans,
                plan.today.used_time))
            setPlanRemoved(false);
        }
        if(planDeleted === true) {
            // No need to do sendDailyPlanData as sendPlanData will update the parent object
            // dispatch(sendDailyPlanData(authCtx, plan))
            dispatch(sendPlanData(authCtx, plan))
            setPlanDeleted(false);
        }
    }, [dispatch, authCtx, plan, planRemoved, planDeleted])

    const findAllParentPlans = useCallback((today_plan, parent_plans, id_plan_map) => {
        parent_plans.push(today_plan.id);
        if (today_plan.parent_id !== undefined) {
            findAllParentPlans(id_plan_map.get(today_plan.parent_id), parent_plans, id_plan_map);
        }
        return parent_plans;
    }, []);

    // todayPlansForDisplay is a mix of plans from today.today_plans and short_term_plan.daily_plans
    // If a plan's date is today, it is from today.today_plans, otherwise it is from short_term_plan.daily_plans
    const todayPlansForDisplay = useMemo(() => {
        const result = [];

        // Order for the following two iteration matters
        const id_plan_map = new Map();
        if (plan.today.today_plans !== undefined) {
            for (const today_plan of plan.today.today_plans) {
                id_plan_map.set(today_plan.id, today_plan);
            }
        }
        for (const daily_plan of plan.short_term_plan.daily_plans) {
            if (!id_plan_map.has(daily_plan.id)) {
                id_plan_map.set(daily_plan.id, daily_plan);
            }
        }

        const planTree = new Map();
        const rootPlans = new Set();
        if (plan.today.today_plans !== undefined) {
            for (const today_plan of plan.today.today_plans) {
                if (filter === "All tasks" ||
                    (filter === "Active tasks" && today_plan.completed === false)) {
                    let parent_plan_ids = findAllParentPlans(today_plan, [], id_plan_map); // parent_plan_ids includes current plan and its parent plans
    
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
        }

        for (const root_plan of rootPlans) {
            // DFS to display the plans in correct order
            let dfs_queue = [root_plan];
            while (dfs_queue.length > 0) {
                const cur_plan = dfs_queue.pop();
                result.push(id_plan_map.get(cur_plan));
                for (const child_plan of Array.from(planTree.get(cur_plan)).reverse()) {
                    dfs_queue.push(child_plan);
                }
            }
        }

        return result;
    }, [plan.today.today_plans, plan.short_term_plan.daily_plans, filter, findAllParentPlans])

    const getTodayDateString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
        const day = today.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const toggleFilterOptions = () => {
        setFilterOptionsVisible((prevState) => !prevState);
    }

    const selectFilterOption = (option) => {
        setFilter(option);
        setFilterOptionsVisible(false); // Hide options after selection
    };

    return (
        <React.Fragment>
            <div className={classes.filter_module}>
                <FontAwesomeIcon className={classes.filter_icon} icon={faFilter} onClick={toggleFilterOptions} />
                {
                    filterOptionsVisible ? (
                    <div className={classes.filter_options}>
                        <span
                            className={`${classes.filter_option} ${filter === "All tasks" ? classes.active_option : ""}`}
                            onClick={() => selectFilterOption("All tasks")}
                        >
                            All tasks
                        </span>
                        <span
                            className={`${classes.filter_option} ${filter === "Active tasks" ? classes.active_option : ""}`}
                            onClick={() => selectFilterOption("Active tasks")}
                        >
                            Active tasks
                        </span>
                    </div>
                    ) :
                    <div className={classes.filter_text}>{filter}</div>
                }
            </div>
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
                            <Row>
                                <Col xs="auto" style={{width: "30px"}}/>
                                <NewDailyPlan
                                    date={getTodayDateString()}
                                />
                            </Row>
                        </Container>
                    </Col>
                    <Col xs={4} className="p-0">
                        <Container>
                            <Row>
                                <Focus />
                            </Row>
                            <TodayPlanSummary
                                today_plans={plan.today.today_plans}
                                used_time={plan.today.used_time}
                            />
                        </Container>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    )
}

export default TodayPlans



/* ========== Learning ========== */
/* useMemo */
// useMemo is a React hook that allows you to memoize the result of a function call.
// It is used to optimize performance by preventing unnecessary re-computations of
// expensive calculations when the dependencies have not changed.