import { createSlice } from '@reduxjs/toolkit'; // reduxjs/toolkit already includes redux

const initialState = {
    daily_plans: []
}

const backlogPlanSlice = createSlice({
    name: 'backlogPlan',
    initialState, // Modern javascript syntax, it's equavilent to initialState: initialState
    reducers: {
        addPlan(state, action) {
            state.daily_plans = action.payload.daily_plans;
        },
        addDailyPlan(state, action) {
            if (action.payload.parent_id === undefined) {
                state.daily_plans.push(action.payload.daily_plan)
            } else {
                for (const [index, daily_plan] of state.daily_plans.entries()) {
                    if (daily_plan.id === action.payload.parent_id) {
                        // Set the date for action.payload.daily_plan to be same as its parent
                        // However, for plan added from Today page, the date is already set to today
                        if (!action.payload.daily_plan.date) {
                            action.payload.daily_plan.date = daily_plan.date
                        }

                        if (index + 1 === state.daily_plans.length) {
                            // If the parent plan is the last plan in the list, just push the new daily plan to the end
                            state.daily_plans.push(action.payload.daily_plan);
                        } else {
                            // Given the index of the parent, insert the new daily plan to the end of all the child plans of the parent
                            const parent_ids = new Set([action.payload.parent_id]);
                            for (let i = index+1; i < state.daily_plans.length; i++) {
                                if(parent_ids.has(state.daily_plans[i].parent_id)) {
                                    parent_ids.add(state.daily_plans[i].id)
                                } else {
                                    state.daily_plans = state.daily_plans.toSpliced(i, 0, action.payload.daily_plan);
                                    break;
                                }
                                if(i+1 === state.daily_plans.length) {
                                    state.daily_plans.push(action.payload.daily_plan);
                                    break; // if not break, we'll fall into infinite loop
                                }
                            }
                        }
                        state.daily_plans[index].has_children = true;
                        break;
                    }
                }
            }
        },
        deleteDailyPlan(state, action) {
            // Delete current plan and all its children plans
            const new_daily_plans = [];
            let id = action.payload.id;
            const parent_ids = new Set([id])

            // The two variables below are used to update current plan's parent plan's attribute has_children
            const parent_id = action.payload.parent_id;
            let has_children = false;

            for(const daily_plan of state.daily_plans) {
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
                for(const daily_plan of state.daily_plans) {
                    if(daily_plan.id === parent_id) {
                        daily_plan.has_children = false;
                        break;
                    }
                }
            }

            state.daily_plans = new_daily_plans;
        },
        setExpectedHours(state, action) {
            for (const daily_plan of state.daily_plans) {
                if (daily_plan.id === action.payload.id) {
                    daily_plan.expected_hours = action.payload.hours;
                    break;
                }
            }
        },
        setExpectedMinutes(state, action) {
            for (const daily_plan of state.daily_plans) {
                if (daily_plan.id === action.payload.id) {
                    daily_plan.expected_minutes = action.payload.minutes;
                    break;
                }
            }
        },
        setDate(state, action) {
            for (const [index, daily_plan] of state.daily_plans.entries()) {
                if (daily_plan.id === action.payload.id) {
                    // Update the date of the current plan and all its children plans
                    daily_plan.date = action.payload.date;
                    if (daily_plan.has_children) {
                        const parent_plan_ids = new Set([daily_plan.id]);
                        for (let i = index + 1; i < state.daily_plans.length; i++) {
                            if (parent_plan_ids.has(state.daily_plans[i].parent_id)) {
                                state.daily_plans[i].date = action.payload.date;
                                if (state.daily_plans[i].has_children) {
                                    parent_plan_ids.add(state.daily_plans[i].id);
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
            let parent_id;
            for (const daily_plan of state.daily_plans) {
                if (daily_plan.id === action.payload.id) {
                    daily_plan.seconds = action.payload.seconds;
                    parent_id = daily_plan.parent_id;
                }
            }
            while (parent_id !== undefined) {
                for (const daily_plan of state.daily_plans) {
                    if (daily_plan.id === parent_id) {
                        daily_plan.seconds += action.payload.new_seconds;
                        parent_id = daily_plan.parent_id;
                        break;
                    }
                }
            }
        }
    }
})

export default backlogPlanSlice;
export const backlogPlanActions = backlogPlanSlice.actions;