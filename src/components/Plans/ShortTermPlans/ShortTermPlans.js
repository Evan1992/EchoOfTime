import React, { useCallback, useState, useEffect } from 'react';

/* ========== import other libraries ========== */
import axios from 'axios';

/* ========== import React components ========== */
import NewShortTermPlan from '../NewPlan/NewShortTermPlan';
import Plans from '../Plans/Plans';

/* ========== import css ========== */
import classes from './ShortTermPlans.module.css';


const ShortTermPlans = (props) => {
    const [plan, setPlan] = useState({});
    const [isFetch, setIsFetch] = useState(false);

    // get data from database function
    const fetchPlansHandler = useCallback(async () => {
        let _plan = {};

        if(!isFetch){
            const response = await axios.get(`https://sound-of-time-2-default-rtdb.firebaseio.com/long_term_plans/active_plans/${props.long_term_plan_id}/short_term_plans/active_plans.json`);
            const data = response.data;
            if(data != null){
                for (let index in data) {
                    _plan = data[index];
                }
            }
            setIsFetch(true);
            setPlan(plan => _plan);
        }
    }, [isFetch, props.long_term_plan_id])

    const showShortTermPlan = (
        <section className={classes.card}>
            <h3>Sprint</h3>
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
                <Plans />
            }
        </React.Fragment>   
    )
}

export default ShortTermPlans