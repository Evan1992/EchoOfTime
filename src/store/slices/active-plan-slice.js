import { createSlice } from '@reduxjs/toolkit'; // reduxjs/toolkit already includes redux
import { isToday } from '../../utilities';

const initialState = {
    title: "",
    description: "",
    date: null,
    short_term_plan: {
        title: "",
        description: "",
        date: null,
        daily_plans: [],
        todo_everyday: {
            dateOfToday: "",
            todo_everyday_plans: []
        },
        changed: false
    },
    today: {
        date: "",
        today_plans: [],
        used_time: 0
    },
    changed: false
}

const setDateForToday = (state, action, targetList) => {
    for(const daily_plan of targetList) {
        if(daily_plan.id === action.payload.id) {
            // Add daily plan and its child plans to state.today.today_plans if the date is set to today
            if (isToday(action.payload.date)) {
                if (state.today.today_plans !== undefined) {
                    state.today.today_plans.push(daily_plan)
                } else {
                    state.today.today_plans = [daily_plan]
                }

                let plan_id_process_queue = [action.payload.id];
                while (plan_id_process_queue.length > 0) {
                    const current_id = plan_id_process_queue.pop();
                    for (const daily_plan of targetList) {
                        if (daily_plan.parent_id === current_id) {
                            // Determine if the plan is already in today_plans before adding
                            let already_in_today_plans = false;
                            for (const today_plan of state.today.today_plans) {
                                if (today_plan.id === daily_plan.id) {
                                    already_in_today_plans = true;
                                    break
                                }
                            }
                            if (!already_in_today_plans) {
                                state.today.today_plans.push(daily_plan)
                            }

                            plan_id_process_queue.push(daily_plan.id);
                        }
                    }
                }
            } else {
                // The selected plan from today page is not today but has children plans that are today
                // Remove all the children plans from today_plans
                let plan_id_process_queue = [action.payload.id];
                while (plan_id_process_queue.length > 0) {
                    const current_id = plan_id_process_queue.pop();
                    for (const daily_plan of targetList) {
                        if (daily_plan.parent_id === current_id) {
                            state.today.today_plans = state.today.today_plans.filter((plan) => plan.id !== daily_plan.id);
                            plan_id_process_queue.push(daily_plan.id);
                        }
                    }
                }
            }

            // Remove daily plan and its child plans from state.today.today_plans if toggled to not today
            if (isToday(daily_plan.date) && (action.payload.date === "" || !isToday(action.payload.date))) {
                for (const today_plan of state.today.today_plans) {
                    if (today_plan.id === action.payload.id) {
                        state.today.today_plans = state.today.today_plans.filter((plan) => plan.id !== today_plan.id);

                        let plan_id_process_queue = [today_plan.id];
                        while (plan_id_process_queue.length > 0) {
                            const current_id = plan_id_process_queue.pop();
                            for (const today_plan of state.today.today_plans) {
                                if (today_plan.parent_id === current_id) {
                                    plan_id_process_queue.push(today_plan.id);
                                    state.today.today_plans = state.today.today_plans.filter((plan) => plan.id !== today_plan.id);
                                }
                            }
                        }

                        break;
                    }
                }
                break;
            }
            break;
        }
    }
}

const addDailyPlanToList = (state, action, dailyPlans)  => {
    if(!dailyPlans) {
        dailyPlans = [];
        dailyPlans.push(action.payload.daily_plan);
    } else {
        if (action.payload.parent_id === undefined) {
            // The new daily plan is the root plan if action.payload.parent_id is undefined
            dailyPlans.push(action.payload.daily_plan);
        } else {
            for (const [index, daily_plan] of dailyPlans.entries()) {
                if (daily_plan.id === action.payload.parent_id) {
                    // Set the date for action.payload.daily_plan to be same as its parent
                    // However, for plan added from Today page, the date is already set to today
                    if (!action.payload.daily_plan.date) {
                        action.payload.daily_plan.date = daily_plan.date
                    }
                    // Set the priority for action.payload.daily_plan to be same as its parent
                    action.payload.daily_plan.priority = daily_plan.priority;

                    if (index + 1 === dailyPlans.length) {
                        // If the parent plan is the last plan in the list, just push the new daily plan to the end
                        dailyPlans.push(action.payload.daily_plan);
                    } else {
                        // Given the index of the parent, insert the new daily plan to the end of all the child plans of the parent
                        const parent_ids = new Set([action.payload.parent_id]);
                        for (let i = index+1; i < dailyPlans.length; i++) {
                            if(parent_ids.has(dailyPlans[i].parent_id)) {
                                parent_ids.add(dailyPlans[i].id)
                            } else {
                                dailyPlans = dailyPlans.toSpliced(i, 0, action.payload.daily_plan);
                                break;
                            }
                            if(i+1 === dailyPlans.length) {
                                dailyPlans.push(action.payload.daily_plan);
                                break; // if not break, we'll fall into infinite loop
                            }
                        }
                    }
                    dailyPlans[index].has_children = true;

                    // Update today_plan.has_children if a child plan is added either from Today page or through Todo Everyday
                    if (action.payload.daily_plan.date !== "" && isToday(action.payload.daily_plan.date)) {
                        for (const today_plan of state.today.today_plans) {
                            if (today_plan.id === action.payload.parent_id) {
                                today_plan.has_children = true;
                                break;
                            }
                        }
                    }

                    break;
                }
            }
        }
    }
    // Add daily plan to state.today.today_plans if the plan is added either from Today page or through Todo Everyday
    if (action.payload.daily_plan.date !== "" && isToday(action.payload.daily_plan.date)) {
        if (state.today.today_plans !== undefined) {
            state.today.today_plans.push(action.payload.daily_plan)
        } else {
            state.today.today_plans = [action.payload.daily_plan]
        }
    }
    return dailyPlans;
}

/* Reducer function outside of createSlice() so we can reuse this function */
const deleteDailyPlanFromList = (state, action, dailyPlans = []) => {
    // Delete current plan and all its children plans
    const new_daily_plans = [];
    let id = action.payload.id;
    const parent_ids = new Set([id])

    // The two variables below are used to update current plan's parent plan's attribute has_children
    const parent_id = action.payload.parent_id;
    let has_children = false;

    for(const daily_plan of dailyPlans) {
        // Not adding current plan and all its children plans to the new_daily_plans
        if(daily_plan.id !== id && !parent_ids.has(daily_plan.parent_id) ) {
            new_daily_plans.push(daily_plan);
        } else {
            parent_ids.add(daily_plan.id);
        }

        // If parent plan still has children under it other than current plan
        if(daily_plan.id !== id && parent_id !== undefined && daily_plan.parent_id === parent_id) {
            has_children = true;
        }
    }

    // Update parent plan's has_chidlren attribute
    if(has_children === false) {
        for (const daily_plan of dailyPlans) {
            if(daily_plan.id === parent_id) {
                daily_plan.has_children = false;
                break;
            }
        }
        if (state.today.today_plans !== undefined) {
            for (const today_plan of state.today.today_plans) {
                if (today_plan.id === parent_id) {
                    today_plan.has_children = false;
                    break;
                }
            }
        }
    }

    return new_daily_plans;
}

const deleteTodayPlan = (state, action) => {
    // Delete current plan and all its children plans
    const plan_ids_to_delete = new Set();
    const plan_id_process_queue = [action.payload.id];

    while (plan_id_process_queue.length > 0) {
        const current_id = plan_id_process_queue.pop();
        plan_ids_to_delete.add(current_id);
        for (const today_plan of state.today.today_plans) {
            if (today_plan.parent_id === current_id) {
                plan_id_process_queue.push(today_plan.id);
            }
        }
    }

    for (const today_plan of state.today.today_plans) {
        if (plan_ids_to_delete.has(today_plan.id)) {
            // Remove the plan from the today_plans array
            state.today.today_plans = state.today.today_plans.filter((plan) => plan.id !== today_plan.id);
        }
    }
}

const activePlanSlice = createSlice({
    name: 'activePlan',
    initialState, // Modern javascript syntax, it's equavilent to initialState: initialState
    reducers: {
        addPlan(state, action) {
            state.title = action.payload.title;
            state.description = action.payload.description;
            state.date = action.payload.date;
            state.today = action.payload.today;
            state.short_term_plan = action.payload.short_term_plan;
            state.changed = action.payload.changed;

            // state.short_term_plan.daily_plans could be undefined
            if(!state.short_term_plan.daily_plans) {
                state.short_term_plan.daily_plans = [];
            }
        },
        // Reset to initialState when the active plan is finished
        removePlan() {
            return initialState;
        },
        addShortTermPlan(state, action){
            state.short_term_plan.title = action.payload.short_term_plan.title;
            state.short_term_plan.description = action.payload.short_term_plan.description;
            state.short_term_plan.date = action.payload.short_term_plan.date;
            state.short_term_plan.daily_plans = action.payload.short_term_plan.daily_plans;
            state.changed = true;
        },
        removeShortTermPlan(state) {
            const dateToday = new Date().toLocaleDateString();
            const split = dateToday.split("/");
            const dateTodayISO = "".concat(split[2], "-", split[0], "-", split[1]);

            state.short_term_plan = {
                title: "",
                description: "",
                date: null,
                daily_plans: [],
                todo_everyday: {
                    dateOfToday: dateTodayISO,
                    todo_everyday_plans: []
                }
            };
            state.changed = true;
        },
        addDailyPlanForTodoEveryPlan(state, action) {
            state.short_term_plan.todo_everyday.todo_everyday_plans = addDailyPlanToList(state, action, state.short_term_plan.todo_everyday.todo_everyday_plans);
        },
        addDailyPlan(state, action) {
            state.short_term_plan.daily_plans = addDailyPlanToList(state, action, state.short_term_plan.daily_plans);
        },
        deleteDailyPlan(state, action) {
            state.short_term_plan.daily_plans = deleteDailyPlanFromList(state, action, state.short_term_plan.daily_plans)
        },
        deleteDailyPlanForTodoEveryPlan(state, action) {
            state.short_term_plan.todo_everyday.todo_everyday_plans = deleteDailyPlanFromList(state, action, state.short_term_plan.todo_everyday.todo_everyday_plans);
        },
        deleteTodayPlan,
        checkDailyPlan(state, action) {
            state.short_term_plan.daily_plans = deleteDailyPlanFromList(state, action, state.short_term_plan.daily_plans);
        },
        checkTodayPlan(state, action) {
            // Check the plan and all its children plans
            const plan_ids_to_check = new Set();
            const plan_id_process_queue = [action.payload.id];
            while (plan_id_process_queue.length > 0) {
                const current_id = plan_id_process_queue.pop();
                plan_ids_to_check.add(current_id);
                for (const today_plan of state.today.today_plans) {
                    if (today_plan.parent_id === current_id) {
                        plan_id_process_queue.push(today_plan.id);
                    }
                }
            }
            for (const today_plan of state.today.today_plans) {
                if (plan_ids_to_check.has(today_plan.id)) {
                    today_plan.completed = true;
                }
            }
            if (state.short_term_plan.todo_everyday.todo_everyday_plans !== undefined) {
                for (const todo_everyday_plan of state.short_term_plan.todo_everyday.todo_everyday_plans) {
                    if (plan_ids_to_check.has(todo_everyday_plan.id)) {
                        todo_everyday_plan.completed = true;
                    }
                }
            }
        },
        showChildPlan(state, action) {
            for (const daily_plan of state.short_term_plan.daily_plans) {
                if (daily_plan.parent_id === action.payload.id) {
                    daily_plan.show_plan = true;
                }
            }
            if (state.today && state.today.today_plans) {
                for (const today_plan of state.today.today_plans) {
                    if (today_plan.parent_id === action.payload.id) {
                        today_plan.show_plan = true;
                    }
                }
            }
            // Show children plans for todo everyday plan
            for (const todo_everyday_plan of state.short_term_plan.todo_everyday.todo_everyday_plans) {
                if (todo_everyday_plan.parent_id === action.payload.id) {
                    todo_everyday_plan.show_plan = true;
                }
            }
        },
        hideChildPlan(state, action) {
            let parent_ids = new Set([action.payload.id]);
            for (const daily_plan of state.short_term_plan.daily_plans) {
                if (parent_ids.has(daily_plan.parent_id)) {
                    daily_plan.show_plan = false;
                    if (daily_plan.has_children === true) {
                        parent_ids.add(daily_plan.id);
                    }
                }
            }
            if (state.today && state.today.today_plans) {
                for (const today_plan of state.today.today_plans) {
                    if (parent_ids.has(today_plan.parent_id)) {
                        today_plan.show_plan = false;
                        if (today_plan.has_children === true) {
                            parent_ids.add(today_plan.id);
                        }
                    }
                }
            }
            // Hide children plans for todo everyday plan
            parent_ids = new Set([action.payload.id]);
            for (const todo_everyday_plan of state.short_term_plan.todo_everyday.todo_everyday_plans) {
                if (parent_ids.has(todo_everyday_plan.parent_id)) {
                    todo_everyday_plan.show_plan = false;
                    if (todo_everyday_plan.has_children === true) {
                        parent_ids.add(todo_everyday_plan.id);
                    }
                }
            }
        },
        setExpectedHours(state, action) {
            const targetList = action.payload.isTodoEverydayPlan ? state.short_term_plan.todo_everyday.todo_everyday_plans : state.short_term_plan.daily_plans;
            for (const daily_plan of targetList) {
                if (daily_plan.id === action.payload.id) {
                    daily_plan.expected_hours = action.payload.hours;

                    if (isToday(daily_plan.date)) {
                        for (const today_plan of state.today.today_plans) {
                            if (today_plan.id === action.payload.id) {
                                today_plan.expected_hours = action.payload.hours;
                                break;
                            }
                        }
                    }
                    break;
                }
            }
        },
        setExpectedMinutes(state, action) {
            const targetList = action.payload.isTodoEverydayPlan ? state.short_term_plan.todo_everyday.todo_everyday_plans : state.short_term_plan.daily_plans;
            for (const daily_plan of targetList) {
                if (daily_plan.id === action.payload.id) {
                    daily_plan.expected_minutes = action.payload.minutes;

                    if (isToday(daily_plan.date)) {
                        for (const today_plan of state.today.today_plans) {
                            if (today_plan.id === action.payload.id) {
                                today_plan.expected_minutes = action.payload.minutes;
                                break;
                            }
                        }
                    }

                    break;
                }
            }
        },
        setPriority(state, action) {
            const targetList = action.payload.isTodoEverydayPlan ? state.short_term_plan.todo_everyday.todo_everyday_plans : state.short_term_plan.daily_plans;

            for (const [index, daily_plan] of targetList.entries()) {
                if (daily_plan.id === action.payload.id) {
                    // Update the priority of the current plan and all its children plans
                    daily_plan.priority = action.payload.priority;
                    if (daily_plan.has_children) {
                        const parent_plan_ids = new Set([daily_plan.id]);
                        for (let i = index + 1; i < targetList.length; i++) {
                            if (parent_plan_ids.has(targetList[i].parent_id)) {
                                targetList[i].priority = action.payload.priority;
                                if (targetList[i].has_children) {
                                    parent_plan_ids.add(targetList[i].id);
                                }
                            } else {
                                break;
                            }
                        }
                    }
                    break;
                }
            }

            // Do the same for today.today_plans
            if (state.today.today_plans !== undefined) {
                for (const [index, today_plan] of state.today.today_plans.entries()) {
                    if (today_plan.id === action.payload.id) {
                        // Update the priority of the current plan and all its children plans
                        today_plan.priority = action.payload.priority;
                        if (today_plan.has_children) {
                            const parent_plan_ids = new Set([today_plan.id]);
                            for (let i = index + 1; i < state.today.today_plans.length; i++) {
                                if (parent_plan_ids.has(state.today.today_plans[i].parent_id)) {
                                    state.today.today_plans[i].priority = action.payload.priority;
                                    if (state.today.today_plans[i].has_children) {
                                        parent_plan_ids.add(state.today.today_plans[i].id);
                                    }
                                } else {
                                    break;
                                }
                            }
                        }
                        break;
                    }
                }
            }
        },
        setDate(state, action) {
            const targetList = action.payload.isTodoEverydayPlan ? state.short_term_plan.todo_everyday.todo_everyday_plans : state.short_term_plan.daily_plans;
            setDateForToday(state, action, targetList);

            for (const [index, daily_plan] of targetList.entries()) {
                if (daily_plan.id === action.payload.id) {
                    // Update the date of the current plan and all its children plans
                    daily_plan.date = action.payload.date;
                    if (daily_plan.has_children) {
                        const parent_plan_ids = new Set([daily_plan.id]);
                        for (let i = index + 1; i < targetList.length; i++) {
                            if (parent_plan_ids.has(targetList[i].parent_id)) {
                                targetList[i].date = action.payload.date;
                                if (targetList[i].has_children) {
                                    parent_plan_ids.add(targetList[i].id);
                                }
                            } else {
                                break;
                            }
                        }
                    }
                    break;
                }
            }
        },
        updateTime(state, action) {
            const targetList = action.payload.isTodoEverydayPlan ? state.short_term_plan.todo_everyday.todo_everyday_plans : state.short_term_plan.daily_plans;

            // Update both current plan and its parent plans
            let parent_id;
            for (const daily_plan of targetList) {
                if (daily_plan.id === action.payload.id) {
                    daily_plan.seconds = action.payload.seconds;

                    // Update today used time
                    if (isToday(daily_plan.date)) {
                        state.today.used_time += action.payload.new_seconds;
                    }

                    parent_id = daily_plan.parent_id;
                }
            }
            while (parent_id !== undefined) {
                for (const daily_plan of targetList) {
                    if (daily_plan.id === parent_id) {
                        daily_plan.seconds += action.payload.new_seconds;
                        parent_id = daily_plan.parent_id;
                        break;
                    }
                }
            }

            // Do the same for today.today_plans
            for (const today_plan of state.today.today_plans) {
                if (today_plan.id === action.payload.id) {
                    today_plan.seconds = action.payload.seconds;
                    parent_id = today_plan.parent_id;
                    break;
                }
            }
            while (parent_id !== undefined) {
                let new_parent_id;
                for (const today_plan of state.today.today_plans) {
                    if (today_plan.id === parent_id) {
                        today_plan.seconds += action.payload.new_seconds;
                        new_parent_id = today_plan.parent_id;
                        break;
                    }
                }
                parent_id = new_parent_id;
            }
        }
    }
})

export default activePlanSlice;
export const activePlanActions = activePlanSlice.actions;




/* ========== Learning ========== */
/* No asynchronous operation within reducer function */
// No asynchronous operation within reducer function, like
// http request. Instead, there are two ways to perform http
// request, one is "useEffect()"", another one is "action creator thunk"

/* Mutate the state within reducer function */
// By all means, we should not mutate the state directly within redux functions.
// For this module, we can mutate the state directly because that's under the help
// of reduxjs/toolkit, behind the scene, reduxjs/toolkit also doesn't mutate
// the state directly, instead, it creats a new object and return that one

/* Reuse the reducer function */
// Reference: https://stackoverflow.com/questions/63564530/is-it-possible-to-call-a-reducer-function-from-another-reducer-function-within
// We can define the reducer function outside the createSlice call and
// call the function within createSlice, so we can reuse the function