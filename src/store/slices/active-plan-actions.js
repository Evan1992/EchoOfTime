import { activePlanActions } from "./active-plan-slice";

export const sendPlanData = (plan) => {
    return async (dispatch) => {
        const postData = async () => {
            const response = await fetch(
                'https://sound-of-time-2-default-rtdb.firebaseio.com/active_plan.json',
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        title: plan.title,
                        description: plan.description,
                        date: plan.date,
                        short_term_plan: plan.short_term_plan
                    })
                }
            )

            if(!response.ok) {
                throw new Error('Sending data failed')
            }
        }

        console.log("Updating the database...");
        await postData();
    }
}

export const fetchPlanData = () => {
    return async (dispatch) => {
        const fetchData = async () => {
            const response = await fetch(
                'https://sound-of-time-2-default-rtdb.firebaseio.com/active_plan.json'
            )

            if(!response.ok) {
                throw new Error('Fetching data failed')
            }

            const data = await response.json();
            return data;
        }

        const planData = await fetchData();

        // planData might be empty if no active plan present
        if(planData) {
            dispatch(
                activePlanActions.addPlan({
                    title: planData.title,
                    description: planData.description,
                    date: planData.date,
                    changed: false,
                    short_term_plan: planData.short_term_plan
                })
            )
        }
    }
}

// Archive the active plan
export const archivePlanData = (plan) => {
    return async (dispatch) => {
        const archiveActivePlan = async () => {
            const response = await fetch(
                'https://sound-of-time-2-default-rtdb.firebaseio.com/archived_plans.json',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        title: plan.title,
                        description: plan.description,
                        date: plan.date,
                        short_term_plans: plan.short_term_plans
                    })
                }
            )
            if(!response.ok) {
                throw new Error('Archiving data failed')
            }
        }

        const deleteActivePlan = async () => {
            const response = await fetch(
                'https://sound-of-time-2-default-rtdb.firebaseio.com/active_plan.json',
                {
                    method: 'DELETE'
                }
            )
            if(!response.ok) {
                throw new Error('Deleting data failed')
            }
        }

        console.log("Updating the database...");
        await archiveActivePlan();
        console.log("Updating the database...");
        await deleteActivePlan();

        dispatch(
            activePlanActions.removePlan()
        )
    }
}

// Method for updating active_plan.short_term_plan
export const sendDailyPlanData = (plan) => {
    return async (dispatch) => {
        const postData = async () => {
            const response = await fetch(
                'https://sound-of-time-2-default-rtdb.firebaseio.com/active_plan/short_term_plan/daily_plans.json',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        title: plan.short_term_plan.daily_plans.at(-1).title,
                        comment: "",
                        date: new Date().toISOString().slice(0,10),
                        seconds: 0,
                        expected_hours: 0,
                        expected_minutes: 0,
                        show_children: false,
                        children: []
                    })
                }
            )
            if(!response.ok) {
                throw new Error('Sending data failed')
            }
        }

        console.log("Updating the database...");
        await postData();
    }
}



/* ========== Learning ========== */
/* Action creator thunk */
// A thunk is a function that delays an action until later,
// so before we perform dispatch, we can run side effect
// code, like http request. It's not within reducer function,
// and we are good to perform the side effect

/* Javascript: check for null/undefined/""/false/0/NaN */
// Reference: https://stackoverflow.com/questions/6003884/how-do-i-check-for-null-values-in-javascript
// if(variable) will check for all "false-like" value null/undefined/""/false/0/NaN
// if (variable === null) check for null SPECIFICALLY
// if (variable === '') check for empty string SPECIFICALLY