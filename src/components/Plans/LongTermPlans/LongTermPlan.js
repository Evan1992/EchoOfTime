import React, { useCallback, useState, useEffect } from 'react';

/* ========== import React components ========== */
import NewLongTermPlan from '../NewPlan/NewLongTermPlan';
import ShortTermPlans from '../ShortTermPlans/ShortTermPlans'

/* ========== import other libraries ========== */
import axios from '../../../axios'

/* ========== import css ========== */
import classes from './LongTermPlan.module.css';

const LongTermPlan = () => {
    // plan is empty object
    const [planId, setPlanId] = useState("");
    const [plan, setPlan] = useState({});
    const [isFetch, setIsFetch] = useState(false);

    // get data from database function
    const fetchPlansHandler = useCallback(async () => {
        let plan_id = "";
        let _plan = {};

        if(!isFetch){
            const response = await axios.get('/long_term_plans/active_plans.json');
            const data = response.data;
            if(data != null){
                for (let index in data) {
                    plan_id = index;
                    _plan = data[index];
                }
            }
            setIsFetch(true);
            setPlanId(planId => plan_id);
            setPlan(plan => _plan);
        }
    }, [isFetch])

    const editPlan = () => {
        // TODO
    }

    const archivePlan = () => {
        // Migrate the plan from active_plans to history_plans
        console.log("Updating the database...");
        axios.post(`/long_term_plans/history_plans.json`, plan);

        // Delete the plan in active_plans
        console.log("Updating the database...");
        axios.delete(`/long_term_plans/active_plans/${planId}.json`)
        .then(response => {
            if(response.status === 200) {
                // Refresh the page
                window.location.reload();
            }
        })
    }

    const showLongTermPlan = (
        <div>
            <section className={classes.card}>
                <div>
                    <h3>Marathon</h3>
                    <button onClick={editPlan}>Edit</button>
                    <button onClick={archivePlan}>Done</button>
                </div>
                <h5>{plan['title']}</h5>
                <div>{plan['description']}</div>
            </section>
            <ShortTermPlans long_term_plan_id={planId} long_term_plan={plan}/>
        </div>
    )

    // get the data from database as soon as user visit the home page
    useEffect(() => {
        fetchPlansHandler();
    }, [fetchPlansHandler]);

    return (
        <React.Fragment>
            {Object.keys(plan).length === 0 &&
                <NewLongTermPlan />
            }

            {Object.keys(plan).length > 0 &&
                showLongTermPlan
            }
        </React.Fragment>
    )
}

export default LongTermPlan

/* ========== Learning ========== */
/* html tag span vs div */
// A div is a block element; a span is an inline element