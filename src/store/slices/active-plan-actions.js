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
                        short_term_plans: plan.short_term_plans
                    })
                }
            )

            if(!response.ok) {
                throw new Error('Sending data failed')
            }
        }

        console.log("Updating the database...");
        await postData();

        dispatch(
            activePlanActions.addPlan({
                title: plan.title,
                description: plan.description,
                date: plan.date,
                short_term_plans: plan.short_term_plans
            })
        )
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

        // short_term_plans could be undefined, if so, assign [] to it
        let short_term_plans = planData.short_term_plans;
        if(planData.short_term_plans === undefined) {
            short_term_plans = [];
        }

        dispatch(
            activePlanActions.addPlan({
                title: planData.title,
                description: planData.description,
                date: planData.date,
                short_term_plans: short_term_plans
            })
        )
    }
}


/* ========== Learning ========== */
/* Action creator thunk */
// A thunk is a function that delays an action until later,
// so before we perform dispatch, we can run side effect
// code, like http request. It's not within reducer function,
// and we are good to perform the side effect