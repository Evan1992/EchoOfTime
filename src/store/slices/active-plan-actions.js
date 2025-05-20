import { activePlanActions } from "./active-plan-slice";
import { refreshIdToken }  from "../auth-context";


export const sendPlanData = (authCtx, plan) => {
    return async (dispatch) => {
        const postData = async (userID, token) => {
            const response = await fetch(
                `https://echo-of-time-8a0aa-default-rtdb.firebaseio.com/${userID}/active_plan.json?auth=${token}`,
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
                const error = new Error('Sending data failed');
                error.status = response.status;
                throw error;
            }

            console.log("Updating the database...");
        }

        try {
            await postData(authCtx.userID, authCtx.token);
        } catch (error) {
            if (error.status === 401 && authCtx.refreshToken) {
                try {
                    const refreshData = await refreshIdToken(authCtx.refreshToken);
                    authCtx.login(refreshData.id_token, refreshData.refresh_token, refreshData.user_id);
                    await postData(refreshData.user_id, refreshData.id_token);
                } catch (refreshError) {
                    alert("Failed to refresh token or put data to firebase");
                    throw refreshError;
                }
            } else {
                alert("Failed to contact firebase");
                throw error;
            }
        }
    }
}

export const fetchPlanData = (authCtx) => {
    console.log("Fetching data from database...");
    return async (dispatch) => {
        const fetchData = async (userID, token) => {
            let response = await fetch(
                `https://echo-of-time-8a0aa-default-rtdb.firebaseio.com/${userID}/active_plan.json?auth=${token}`,
            )

            if(!response.ok) {
                const error = new Error('Fetching data failed');
                error.status = response.status;
                throw error;
            }

            const data = await response.json();
            return data;
        }

        let planData;
        try {
            planData = await fetchData(authCtx.userID, authCtx.token);
        } catch (error) {
            if (error.status === 401 && authCtx.refreshToken) {
                try {
                    const refreshData = await refreshIdToken(authCtx.refreshToken);
                    authCtx.login(refreshData.id_token, refreshData.refresh_token, refreshData.user_id);
                    planData = await fetchData(refreshData.user_id, refreshData.id_token);
                } catch (refreshError) {
                    alert("Failed to refresh token or fetch data from firebase");
                    throw refreshError;
                }
            } else {
                alert("Failed to contact firebase");
                throw error;
            }
        }

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

export const refreshToday = (authCtx, today_plans) => {
    return async (dispatch) => {
        const postData = async (userID, token) => {
            const dateToday = new Date().toLocaleDateString();
            const split = dateToday.split("/")
            const dateTodayISO = "".concat(split[2], "-", split[0], "-", split[1])
            const response = await fetch(
                `https://echo-of-time-8a0aa-default-rtdb.firebaseio.com/${userID}/active_plan/today.json?auth=${token}`,
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        date: dateTodayISO,
                        today_plans: today_plans,
                        used_time: 0
                    })
                }
            )

            if(!response.ok) {
                const error = new Error('Sending data failed');
                error.status = response.status;
                throw error;
            }

            console.log("Updating the database...");
        }

        try {
            await postData(authCtx.userID, authCtx.token);
        } catch (error) {
            if (error.status === 401 && authCtx.refreshToken) {
                try {
                    const refreshData = await refreshIdToken(authCtx.refreshToken);
                    authCtx.login(refreshData.id_token, refreshData.refresh_token, refreshData.user_id);
                    await postData(refreshData.user_id, refreshData.id_token);
                } catch (refreshError) {
                    alert("Failed to refresh token or put data to firebase");
                    throw refreshError;
                }
            } else {
                alert("Failed to contact firebase");
                throw error;
            }
        }
    }
}

export const updateToday = (authCtx, date, todayPlans, usedTime) => {
    return async (dispatch) => {
        const postData = async (userID, token) => {
            const response = await fetch(
                `https://echo-of-time-8a0aa-default-rtdb.firebaseio.com/${userID}/active_plan/today.json?auth=${token}`,
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
                const error = new Error('Sending data failed');
                error.status = response.status;
                throw error;
            }

            console.log("Updating the database...");
        }

        try {
            await postData(authCtx.userID, authCtx.token);
        } catch (error) {
            if (error.status === 401 && authCtx.refreshToken) {
                try {
                    const refreshData = await refreshIdToken(authCtx.refreshToken);
                    authCtx.login(refreshData.id_token, refreshData.refresh_token, refreshData.user_id);
                    await postData(refreshData.user_id, refreshData.id_token);
                } catch (refreshError) {
                    alert("Failed to refresh token or put data to firebase");
                    throw refreshError;
                }
            } else {
                alert("Failed to contact firebase");
                throw error;
            }
        }
    }
}

// Archive the active plan
export const archivePlanData = (userID, token, plan) => {
    return async (dispatch) => {
        const archiveActivePlan = async () => {
            const response = await fetch(
                `https://echo-of-time-8a0aa-default-rtdb.firebaseio.com/archived_plans.json?auth=${token}`,
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
                alert("Failed to contact firebase")
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
                alert("Failed to contact firebase")
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
export const sendDailyPlanData = (userID, token, plan) => {
    return async (dispatch) => {
        const postData = async () => {
            const response = await fetch(
                `https://echo-of-time-8a0aa-default-rtdb.firebaseio.com/${userID}/active_plan/short_term_plan.json?auth=${token}`,
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
                alert("Failed to contact firebase")
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

/* Firebase ID token */
// Firebase ID token is a short-lived token that is valid for 1 hour
// After 1 hour, the token will expire and we need to refresh it
// Firebase refresh token is a long-lived token that is valid for 30 days
// After 30 days, the refresh token will expire and we need to re-authenticate