import React, { useState, useEffect, useCallback } from 'react';

/* ========== import React components ========== */
import Plan from './Plan'
import NewPlan from './NewPlan/NewPlan'

/* ========== import other libraries ========== */
import Container from 'react-bootstrap/Container';

/* ========== import css ========== */
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const Plans = () => {
    const [plans, setPlans] = useState([]);
    const [plan_ids, setPlanIds] = useState([]);
    const [isFetch, setIsFetch] = useState(false);

    // get data from database
    const fetchPlansHandler = useCallback(async () => {
        if(!isFetch){
            const response = await axios.get('https://sound-of-time-2-default-rtdb.firebaseio.com/plans.json');
            const data = response.data;
            for (let index in data) {
                await setPlanIds(oldArray => [...oldArray, index]);
                await setPlans(oldArray => [...oldArray, response.data[index]]);
            }
            setIsFetch(true);
        }
    }, [isFetch])

    // get the data from database as soon as user visit the home page
    useEffect(() => {
        fetchPlansHandler();
    }, [fetchPlansHandler]);

    return (
        <React.Fragment>
            <Container>
                {
                    plans.map((element, index) => (
                        <Plan key={plan_ids[index]} plan={element} plan_id={plan_ids[index]} plan_title={element.title} plan_rank={element.rank} />
                    ))
                }
                <NewPlan />
            </Container>
        </React.Fragment>
    )
}

export default Plans


/* ========== Learning ========== */
/* UseEffect */
// The Effect Hook lets you perform side effects in function components.
// In this component, the hook helps request the data from database

/* useCallback */
// We can sepcify the dependency of the function called in useEffect, here, the dependency is the
// function itself. The function as an object, will change, and it results in infinite loop. We
// wrap the function in the useCallback hook
