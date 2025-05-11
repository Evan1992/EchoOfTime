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
        changed: false
    },
    today: {
        date: "",
        today_plans: [],
        used_time: 0
    },
    checked_tasks_today: {
        date: "",
        expected_time: 0,
        used_time: 0
    },
    changed: false
}

const setDateForToday = (state, action) => {
    for(const daily_plan of state.short_term_plan.daily_plans) {
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
                    for (const daily_plan of state.short_term_plan.daily_plans) {
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

/* Reducer function outside of createSlice() so we can reuse this function */
const deleteDailyPlan = (state, action) => {
    // Delete current plan and all its children plans
    const new_daily_plans = [];
    let id = state.short_term_plan.daily_plans[action.payload.index].id;
    const parent_ids = new Set([id])

    // The two variables below are used to update current plan's parent plan's attribute has_children
    const parent_id = state.short_term_plan.daily_plans[action.payload.index].parent_id;
    let has_children = false;

    for(const daily_plan of state.short_term_plan.daily_plans) {
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
        for(const daily_plan of state.short_term_plan.daily_plans) {
            if(daily_plan.id === parent_id) {
                daily_plan.has_children = false;
                break;
            }
        }
    }

    state.short_term_plan.daily_plans = new_daily_plans;
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
            state.checked_tasks_today = action.payload.checked_tasks_today;
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
            state.short_term_plan = {
                title: "",
                description: "",
                date: null,
                daily_plans: []
            };
            state.changed = true;
        },
        addDailyPlan(state, action) {
            if(!state.short_term_plan.daily_plans) {
                state.short_term_plan.daily_plans = [];
                state.short_term_plan.daily_plans.push(action.payload.daily_plan);
            } else {
                // The new daily plan is the root plan if action.payload.index is undefined
                if(action.payload.index === undefined) {
                    state.short_term_plan.daily_plans.push(action.payload.daily_plan);
                } else {
                    if(action.payload.index+1 === state.short_term_plan.daily_plans.length) {
                        // The new daily plan will be added to the end of the list daily_plans
                        state.short_term_plan.daily_plans.push(action.payload.daily_plan);
                    } else {
                        // Given the index of the parent, insert the new daily plan to the last of all the child plans of the parent
                        const parent_ids = new Set([action.payload.parent_id]);
                        for(let i = action.payload.index+1; i < state.short_term_plan.daily_plans.length; i++) {
                            if(parent_ids.has(state.short_term_plan.daily_plans[i].parent_id)) {
                                parent_ids.add(state.short_term_plan.daily_plans[i].id)
                            } else {
                                state.short_term_plan.daily_plans = state.short_term_plan.daily_plans.toSpliced(i, 0, action.payload.daily_plan);
                                break;
                            }
                            if(i+1 === state.short_term_plan.daily_plans.length) {
                                state.short_term_plan.daily_plans.push(action.payload.daily_plan);
                                break; // if not break, we'll fall into infinite loop
                            }
                        }
                    }
                    state.short_term_plan.daily_plans[action.payload.index].has_children = true;
                }
            }

            // Add daily plan to state.today.today_plans if the plan is added from Today page
            if (action.payload.daily_plan.date !== "" && isToday(action.payload.daily_plan.date)) {
                if (state.today.today_plans !== undefined) {
                    state.today.today_plans.push(action.payload.daily_plan)
                } else {
                    state.today.today_plans = [action.payload.daily_plan]
                }
            }
        },
        deleteDailyPlan,
        deleteTodayPlan,
        checkDailyPlan(state, action) {
            // When checking a plan, store the expected time and used time in the database
            if(isToday(state.short_term_plan.daily_plans[action.payload.index].date)) {
                if(isToday(state.checked_tasks_today.date)) {
                    state.checked_tasks_today.expected_time += (
                        state.short_term_plan.daily_plans[action.payload.index].expected_hours * 60 * 60 +
                        state.short_term_plan.daily_plans[action.payload.index].expected_minutes * 60
                    )
                    state.checked_tasks_today.used_time += state.short_term_plan.daily_plans[action.payload.index].seconds;
                } else {
                    state.checked_tasks_today.date = state.short_term_plan.daily_plans[action.payload.index].date
                    state.checked_tasks_today.expected_time = (
                        state.short_term_plan.daily_plans[action.payload.index].expected_hours * 60 * 60 +
                        state.short_term_plan.daily_plans[action.payload.index].expected_minutes * 60
                    )
                    state.checked_tasks_today.used_time = state.short_term_plan.daily_plans[action.payload.index].seconds;
                }
            }
            deleteDailyPlan(state, action);
        },
        showChildPlan(state, action) {
            for(let i = action.payload.index+1; i < state.short_term_plan.daily_plans.length; i++) {
                if(state.short_term_plan.daily_plans[i].parent_id === action.payload.id) {
                    state.short_term_plan.daily_plans[i].show_plan = true;
                }
            }
        },
        hideChildPlan(state, action) {
            const parent_ids = new Set([action.payload.id]);

            for(let i = action.payload.index+1; i < state.short_term_plan.daily_plans.length; i++) {
                if(parent_ids.has(state.short_term_plan.daily_plans[i].parent_id)) {
                    state.short_term_plan.daily_plans[i].show_plan = false;
                    if(state.short_term_plan.daily_plans[i].has_children === true) {
                        parent_ids.add(state.short_term_plan.daily_plans[i].id);
                    }
                }
            }
        },
        setExpectedHours(state, action) {
            state.short_term_plan.daily_plans[action.payload.index].expected_hours = action.payload.hours;
        },
        setExpectedMinutes(state, action) {
            state.short_term_plan.daily_plans[action.payload.index].expected_minutes = action.payload.minutes;
        },
        setDate(state, action) {
            setDateForToday(state, action);

            for (const [index, daily_plan] of state.short_term_plan.daily_plans.entries()) {
                if (daily_plan.id === action.payload.id) {
                    // Update the date of the current plan and all its children plans
                    daily_plan.date = action.payload.date;
                    if (daily_plan.has_children) {
                        const parent_plan_ids = new Set([daily_plan.id]);
                        for (let i = index + 1; i < state.short_term_plan.daily_plans.length; i++) {
                            if (parent_plan_ids.has(state.short_term_plan.daily_plans[i].parent_id)) {
                                state.short_term_plan.daily_plans[i].date = action.payload.date;
                                if (state.short_term_plan.daily_plans[i].has_children) {
                                    parent_plan_ids.add(state.short_term_plan.daily_plans[i].id);
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
            // Update both current plan and its parent plans
            let index = action.payload.index;
            state.short_term_plan.daily_plans[index].seconds = action.payload.seconds;
            while(index !== null) {
                if(state.short_term_plan.daily_plans[index].parent_id !== undefined) {
                    for(let i in state.short_term_plan.daily_plans) {
                        if(state.short_term_plan.daily_plans[i].id === state.short_term_plan.daily_plans[index].parent_id) {
                            index = i;
                            state.short_term_plan.daily_plans[i].seconds += action.payload.new_seconds;
                            break
                        }
                    }
                } else {
                    index = null;
                }
            }

            // Update today used time
            if(isToday(state.short_term_plan.daily_plans[action.payload.index].date)) {
                state.today.used_time += action.payload.new_seconds;
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