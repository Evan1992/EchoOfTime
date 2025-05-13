import { activePlanActions } from "./active-plan-slice";


export const sendPlanData = (userID, plan) => {
    return async (dispatch) => {
        const postData = async () => {
            const response = await fetch(
                `https://echo-of-time-8a0aa-default-rtdb.firebaseio.com/${userID}/active_plan.json`,
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        title: plan.title,
                        description: plan.description,
                        date: plan.date,
                        today: plan.today,
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

export const fetchPlanData = (userID) => {
    return async (dispatch) => {
        const fetchData = async () => {
            const response = await fetch(
                `https://echo-of-time-8a0aa-default-rtdb.firebaseio.com/${userID}/active_plan.json`
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
                    today: planData.today,
                    short_term_plan: planData.short_term_plan
                })
            )
        }
    }
}

export const refreshToday = (userID) => {
    return async (dispatch) => {
        const postData = async () => {
            const dateToday = new Date().toLocaleDateString();
            const split = dateToday.split("/")
            const dateTodayISO = "".concat(split[2], "-", split[0], "-", split[1])
            const response = await fetch(
                `https://echo-of-time-8a0aa-default-rtdb.firebaseio.com/${userID}/active_plan/today.json`,
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        date: dateTodayISO,
                        today_plans: [],
                        used_time: 0
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

export const updateToday = (userID, date, todayPlans, usedTime) => {
    return async (dispatch) => {
        const postData = async () => {
            const response = await fetch(
                `https://echo-of-time-8a0aa-default-rtdb.firebaseio.com/${userID}/active_plan/today.json`,
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        date: date,
                        today_plans: todayPlans,
                        used_time: usedTime,
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

// Archive the active plan
export const archivePlanData = (userID, plan) => {
    return async (dispatch) => {
        const archiveActivePlan = async () => {
            const response = await fetch(
                'https://echo-of-time-8a0aa-default-rtdb.firebaseio.com/archived_plans.json',
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
                `https://echo-of-time-8a0aa-default-rtdb.firebaseio.com/${userID}/active_plan.json`,
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
export const sendDailyPlanData = (userID, plan) => {
    return async (dispatch) => {
        const postData = async () => {
            const response = await fetch(
                `https://echo-of-time-8a0aa-default-rtdb.firebaseio.com/${userID}/active_plan/short_term_plan.json`,
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        title: plan.short_term_plan.title,
                        description: plan.short_term_plan.description,
                        date: plan.short_term_plan.date,
                        daily_plans: plan.short_term_plan.daily_plans
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