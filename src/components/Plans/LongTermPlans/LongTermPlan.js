import React, { useCallback, useState, useEffect } from 'react';

/* ========== import React components ========== */
import NewLongTermPlan from '../NewPlan/NewLongTermPlan';

/* ========== import other libraries ========== */
import axios from 'axios';

const LongTermPlan = () => {
    // plans is map, key is the plan_id, value is the plan object
    const [plans, setPlans] = useState(new Map());
    const [isFetch, setIsFetch] = useState(false);

    // get data from database function
    const fetchPlansHandler = useCallback(async () => {
        let _plans = new Map();

        if(!isFetch){
            const response = await axios.get('https://sound-of-time-2-default-rtdb.firebaseio.com/plans.json');
            const data = response.data;
            if(data != null){
                for (let index in data) {
                    _plans.set(index, data[index]);
                }
            }
            setIsFetch(true);
            setPlans(plans => _plans);
        }
    }, [isFetch])

    // get the data from database as soon as user visit the home page
    useEffect(() => {
        fetchPlansHandler();
    }, [fetchPlansHandler]);

    return (
        <React.Fragment>
            {plans.size === 0 &&
                <NewLongTermPlan />   
            }
        </React.Fragment>
    )
}

export default LongTermPlan