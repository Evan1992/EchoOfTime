import { createSlice } from '@reduxjs/toolkit'; // reduxjs/toolkit already includes redux

const initialState = {
    title: "",
    description: "",
    date: null,
    short_term_plan: {
        title: "",
        description: "",
        date: null,
        daily_plans: [],
        ordered_daily_plans: [],
        changed: false
    },
    changed: false
}

const activePlanSlice = createSlice({
    name: 'activePlan',
    initialState, // Modern javascript syntax, it's equavilent to initialState: initialState
    reducers: {
        addPlan(state, action) {
            state.title = action.payload.title;
            state.description = action.payload.description;
            state.date = action.payload.date;
            state.short_term_plan = action.payload.short_term_plan;
            state.changed = action.payload.changed;

            // state.short_term_plan.daily_plans could be undefined
            if(!state.short_term_plan.daily_plans) {
                state.short_term_plan.daily_plans = [];
            } else {
                // Build ordered_daily_plans after fetching the data
                let ordered_daily_plans = []
                let root_daily_plan_ids = []
                let id_plan_map = new Map();
                let tree = new Map();
                for(let index in state.short_term_plan.daily_plans) {
                    let daily_plan = state.short_term_plan.daily_plans[index]
                    id_plan_map.set(daily_plan.id, daily_plan);
                    if(daily_plan.parent_id !== undefined) {
                        if(tree.has(daily_plan.parent_id)) {
                            tree.get(daily_plan.parent_id).unshift(daily_plan.id); // Add to the front of the array
                        } else {
                            tree.set(daily_plan.parent_id, [daily_plan.id]);
                        }
                    } else {
                        // daily_plan.id is the id for root daily plan
                        tree.set(daily_plan.id, []);
                        root_daily_plan_ids.push(daily_plan.id);
                    }
                }

                // DFS
                for(let root_id of root_daily_plan_ids) {
                    ordered_daily_plans.push(id_plan_map.get(root_id));
                    let branch = tree.get(root_id)
                    while(branch.length > 0) {
                        let cur_plan_id = branch.pop();
                        ordered_daily_plans.push(id_plan_map.get(cur_plan_id));
                        // Current plan is not a leaf node
                        if(tree.has(cur_plan_id)) {
                            for(let id of tree.get(cur_plan_id)) {
                                branch.push(id);
                            }
                        }
                    }
                }

                state.short_term_plan.ordered_daily_plans = ordered_daily_plans;
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
            state.short_term_plan.daily_plans = action.payload.daily_plans;
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
            }
            state.short_term_plan.daily_plans.push(action.payload.daily_plan);

            // The new daily plan is the root plan if action.payload.index is undefined
            if(action.payload.index === undefined) {
                state.short_term_plan.ordered_daily_plans.push(action.payload.daily_plan);
            } else {
                if(action.payload.index+1 == state.short_term_plan.ordered_daily_plans.length) {
                    state.short_term_plan.ordered_daily_plans.push(action.payload.daily_plan);
                } else {
                    // Given the index of the parent, insert the new daily plan to the last of all the child plans of the parent
                    for(let i = action.payload.index+1; i < state.short_term_plan.ordered_daily_plans.length; i++) {
                        if(state.short_term_plan.ordered_daily_plans[i].parent_id != action.payload.parent_id) {
                            state.short_term_plan.ordered_daily_plans = state.short_term_plan.ordered_daily_plans.toSpliced(i, 0, action.payload.daily_plan);
                            break;
                        }
                    }
                }
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
// reuqest, one is "useEffect()"", another one is "action creator thunk"

/* Mutate the state within reducer function */
// By all means, we should not mutate the state directly within redux functions.
// For this module, we mutate the state directly because that's under the help
// of reduxjs/toolkit, behind the scene, reduxjs/toolkit also doesn't mutate
// the state directly, instead, it creats a new object and return that one