import React, { useCallback, useState, useEffect } from 'react';

/* ========== import React components ========== */
import NewLongTermPlan from '../NewPlan/NewLongTermPlan';

/* ========== import other libraries ========== */
import axios from 'axios';

/* ========== import css ========== */
import classes from './LongTermPlan.module.css';

const LongTermPlan = () => {
    // plan is empty object
    const [plan, setPlan] = useState({});
    const [isFetch, setIsFetch] = useState(false);

    // get data from database function
    const fetchPlansHandler = useCallback(async () => {
        let _plan = {};

        if(!isFetch){
            const response = await axios.get('https://sound-of-time-2-default-rtdb.firebaseio.com/long_term_plans.json');
            const data = response.data;
            if(data != null){
                for (let index in data) {
                    _plan = data[index];
                }
            }
            setIsFetch(true);
            setPlan(plan => _plan)
        }
    }, [isFetch])

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
                <section className={classes.card}>
                    <h3>Marathon</h3>
                    <h5>{plan['title']}</h5>
                    <div>{plan['description']}</div>
                </section>
            }
        </React.Fragment>
    )
}

export default LongTermPlan

/* ========== Learning ========== */
/* html tag span vs div */
// A div is a block element; a span is an inline element