import React, { useCallback, useState, useEffect, useContext } from 'react';

/* ========== import React components ========== */
import Plans from '../DailyPlans/Plans';
import InlineEdit from '../../UI/InlineEdit';
import AuthContext from '../../../store/auth-context';

/* ========== import css ========== */
import classes from './ShortTermPlans.module.css';


const ShortTermPlans = (props) => {
    const [plan, setPlan] = useState({});
    const [planId, setPlanId] = useState();
    const [isFetch, setIsFetch] = useState(false);

    // Object for interacting with database endpoint
    const authCtx = useContext(AuthContext);
    const instance = authCtx.firebase;

    // get data from database function
    const fetchPlansHandler = useCallback(async () => {
        let plan_id = "";
        let _plan = {};

        if(!isFetch){
            const response = await instance.get(`/long_term_plans/active_plans/${props.long_term_plan_id}/short_term_plans/active_plans.json`);
            const data = response.data;
            if(data != null){
                for (let index in data) {
                    plan_id = index;
                    _plan = data[index];
                }
            }
            setIsFetch(true);
            setPlanId(planId => plan_id)
            setPlan(plan => _plan);
        }
    }, [isFetch, props.long_term_plan_id, instance])

    const postPlanHandler= (inputTitle, inputDescription, inputDescriptionHeight) => {
        const target = {
            title: inputTitle,
            description: inputDescription,
            description_height: inputDescriptionHeight,
            date: new Date().toISOString().slice(0,10),
            daily_plans: {}
        };

        console.log("Updating the database...");
        instance.post(`/long_term_plans/active_plans/${props.long_term_plan_id}/short_term_plans/active_plans.json`, target)
        .then(res => {
            // Refresh the page after posting the data
            window.location.reload();
        })
    }

    const updatePlanHandler = (inputTitle, inputDescription, inputDescriptionHeight) => {
        const config = { headers: {'Content-Type': 'application/json'} };
        if(inputTitle !== plan['title']){
            console.log("Updating the database...");
            instance.put(`/long_term_plans/active_plans/${props.long_term_plan_id}/short_term_plans/active_plans/${planId}/title.json`, inputTitle, config)
            .then(res => {
                // Refresh the page after posting the data
                window.location.reload();
            })
        }
        if(inputDescription !== plan['description']){
            console.log("Updating the database...");
            instance.put(`/long_term_plans/active_plans/${props.long_term_plan_id}/short_term_plans/active_plans/${planId}/description.json`, inputDescription, config)
            instance.put(`/long_term_plans/active_plans/${props.long_term_plan_id}/short_term_plans/active_plans/${planId}/description_height.json`, inputDescriptionHeight, config)
            .then(res => {
                // Refresh the page after posting the data
                window.location.reload();
            })
        }
    }

    const archivePlanHandler = () => {
        // Migrate the plan from active_plans to history_plans
        console.log("Updating the database...");
        instance.post(`/long_term_plans/active_plans/${props.long_term_plan_id}/short_term_plans/history_plans.json`, plan)

        // Delete the plan in active_plans
        console.log("Updating the database...");
        instance.delete(`/long_term_plans/active_plans/${props.long_term_plan_id}/short_term_plans/active_plans/${planId}.json`)
        .then(response => {
            if(response.status === 200) {
                // Refresh the page
                window.location.reload();
            }
        })
    }

    // get the data from database as soon as user visit the home page
    useEffect(() => {
        fetchPlansHandler();
    }, [fetchPlansHandler]);

    return (
        <React.Fragment>
            {/* Show short_term_plan */}
            <section className={classes.card}>
                <div>
                    <h3>Sprint</h3>
                    <button onClick={archivePlanHandler}>Done</button>
                </div>
                {Object.keys(plan).length === 0 &&
                    <InlineEdit 
                        inputTitle=""
                        inputDescription=""
                        inputDescriptionHeight="100px"
                        postPlan={postPlanHandler}
                    />
                }

                {Object.keys(plan).length > 0 &&
                    <InlineEdit 
                        inputTitle={plan['title']}
                        inputDescription={plan['description']}
                        inputDescriptionHeight={plan['description_height']}
                        postPlan={updatePlanHandler}
                    />
                }
            </section>

            {/* Show daily_plans if short_term_plan exists */}
            {Object.keys(plan).length > 0 &&
                <Plans long_term_plan_id={props.long_term_plan_id} short_term_plan_id={planId} />
            }
        </React.Fragment>   
    )
}

export default ShortTermPlans

/* ========== Learning ========== */
/* Posting data and asynchronous call */
// If we write code like below, the database won't be updated and the page get refreshed.
// This is because the http request is sent to the backend, but before the response get back
// to the requester, the page is already refreshed, so the TCP handshake is not completely done.
    /* 
        instance.put(...);
        window.location.reload();
    */
