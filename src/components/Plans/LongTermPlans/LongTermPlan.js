import React, { useCallback, useState, useEffect } from 'react';

/* ========== import React components ========== */
import NewLongTermPlan from '../NewPlan/NewLongTermPlan';

/* ========== import other libraries ========== */
import axios from 'axios';

const LongTermPlan = () => {
    // plan is empty object
    const [plan, setPlan] = useState({});
    const [isFetch, setIsFetch] = useState(false);

    // get data from database function
    const fetchPlansHandler = useCallback(async () => {
        let _plan = {};

        if(!isFetch){
            const response = await axios.get('https://sound-of-time-2-default-rtdb.firebaseio.com/plans.json');
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
        </React.Fragment>
    )
}

export default LongTermPlan