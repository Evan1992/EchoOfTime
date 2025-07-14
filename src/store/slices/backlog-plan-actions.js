import { backlogPlanActions } from "./backlog-plan-slice";
import { refreshIdToken }  from "../auth-context";

export const fetchPlanData = (authCtx) => {
    console.log("Fetching data from database...");
    return async (dispatch) => {
        const fetchData = async (userID, token) => {
            let response = await fetch(
                `https://echo-of-time-8a0aa-default-rtdb.firebaseio.com/${userID}/backlog/daily_plans.json?auth=${token}`,
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
                backlogPlanActions.addPlan({
                    daily_plans: planData
                })
            )
        }
    }
}

export const sendDailyPlanDataToBacklog = (authCtx, plan) => {
    return async (dispatch) => {
        const postData = async (userID, token) => {
            const response = await fetch(
                `https://echo-of-time-8a0aa-default-rtdb.firebaseio.com/${userID}/backlog.json?auth=${token}`,
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        daily_plans: plan.daily_plans
                    })
                }
            )

            if(!response.ok) {
                const error = new Error('Sending data failed');
                error.status = response.status;
                throw error;
            }
        }

        console.log("Updating the database...");

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