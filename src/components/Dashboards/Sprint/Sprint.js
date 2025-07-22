/* ========== import React and React hooks ========== */
import React from 'react';
import { useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';

/* ========== import React components ========== */
import DailyPlans from '../../Plans/DailyPlans/DailyPlans';
import AuthContext from '../../../store/auth-context';

/* ========== import other libraries ========== */
import { fetchPlanData } from '../../../store/slices/active-plan-actions';

/* ========== import css ========== */
import 'bootstrap/dist/css/bootstrap.min.css';

const Sprint = () => {
    const authCtx = useContext(AuthContext);
    const plan = useSelector((state) => state.activePlan);
    const dispatch = useDispatch();

    // Get the data from database as soon as user visit Sprint page
    useEffect(() => {
        // Check if the plan is already fetched
        if (plan.title === "") {
            dispatch(fetchPlanData(authCtx));
        }
    }, [plan, authCtx, dispatch])

    return (
        <React.Fragment>
            {/* Separation between Navigation and DailyPlans */}
            <div style={{height: "20px"}} />

            <DailyPlans />
        </React.Fragment>
    )
}

export default Sprint
