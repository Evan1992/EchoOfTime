import React, { useCallback, useState, useEffect } from 'react';

/* ========== import other libraries ========== */
import axios from '../../../axios'

/* ========== import React components ========== */
import NewShortTermPlan from '../NewPlan/NewShortTermPlan';
import Plans from '../DailyPlans/Plans';

/* ========== import css ========== */
import classes from './ShortTermPlans.module.css';


const ShortTermPlans = (props) => {
    const [plan, setPlan] = useState({});
    const [planId, setPlanId] = useState();
    const [isFetch, setIsFetch] = useState(false);

    // get data from database function
    const fetchPlansHandler = useCallback(async () => {
        let plan_id = "";
        let _plan = {};

        if(!isFetch){
            const response = await axios.get(`/long_term_plans/active_plans/${props.long_term_plan_id}/short_term_plans/active_plans.json`);
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
    }, [isFetch, props.long_term_plan_id])

    const editPlan = () => {
        // TODO
    }

    const archivePlan = () => {
        // Migrate the plan from active_plans to history_plans
        console.log("Updating the database...");
        axios.post(`/long_term_plans/active_plans/${props.long_term_plan_id}/short_term_plans/history_plans.json`, plan)

        // Delete the plan in active_plans
        console.log("Updating the database...");
        axios.delete(`/long_term_plans/active_plans/${props.long_term_plan_id}/short_term_plans/active_plans/${planId}.json`)
        .then(response => {
            if(response.status === 200) {
                // Refresh the page
                window.location.reload();
            }
        })
    }

    const showShortTermPlan = (
        <section className={classes.card}>
            <div>
                <h3>Sprint</h3>
                <button onClick={editPlan}>Edit</button>
                <button onClick={archivePlan}>Done</button>
            </div>
            <h5>{plan['title']}</h5>
            <div>{plan['description']}</div>
        </section>
    )

    // get the data from database as soon as user visit the home page
    useEffect(() => {
        fetchPlansHandler();
    }, [fetchPlansHandler]);

    return (
        <React.Fragment>
            {Object.keys(plan).length === 0 &&
                <NewShortTermPlan long_term_plan_id={props.long_term_plan_id} />
            }

            {Object.keys(plan).length > 0 &&
                showShortTermPlan
            }

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
        axios.put(...);
        window.location.reload();
    */