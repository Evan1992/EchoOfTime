import React, { useState } from 'react'

const PlansOfTodayContext = React.createContext(null)

export const PlansOfTodayContextProvider = (props) => {
    const default_plans_of_today = new Map()
    props.today_plans.forEach((plan) => {
        default_plans_of_today.set(plan.title, [plan.seconds, plan.expected_hours, plan.expected_minutes])
    })
    const [plans_of_today, setPlans] = useState(default_plans_of_today);

    const addPlanHandler = (plan) => {
        // Use plan title as the key, might come across issue if duplicated plan title
        if(!plans_of_today.has(plan.title)) {
            plans_of_today.set(plan.title, [plan.seconds, plan.expected_hours, plan.expected_minutes])
            setPlans(plans_of_today => plans_of_today)
        }
    }

    const removePlanHandler = (plan) => {
        // Remove the plan from plans_of_today map if it's not today's plan
        if(plans_of_today.has(plan.title)) {
            plans_of_today.delete(plan.title)
        } else {
            // TODO: Throw the error. Currently, print out a message
            console.log("Plan not found")
        }
    }

    const contextValue = {
        plans_of_today: plans_of_today,
        addPlan: addPlanHandler,
        removePlan: removePlanHandler
    }

    return <PlansOfTodayContext.Provider value={contextValue}>
        {props.children}
    </PlansOfTodayContext.Provider>
}

export default PlansOfTodayContext;



/* ========== Learning ========== */
/* useContext */
// Reference: https://stackoverflow.com/questions/54738681/how-to-change-the-value-of-a-context-with-usecontext