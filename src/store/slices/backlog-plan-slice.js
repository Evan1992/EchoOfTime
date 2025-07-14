import { createSlice } from '@reduxjs/toolkit'; // reduxjs/toolkit already includes redux
import { isToday } from '../../utilities';

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
        }
    }
})

export default backlogPlanSlice;
export const backlogPlanActions = backlogPlanSlice.actions;