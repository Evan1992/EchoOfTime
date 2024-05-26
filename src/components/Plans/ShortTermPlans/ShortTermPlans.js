/* ========== import React and React hooks ========== */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

/* ========== import React components ========== */
import InlineEdit from '../../UI/InlineEdit';

/* ========== import css ========== */
import classes from './ShortTermPlans.module.css';

const ShortTermPlans = (props) => {
    const plan = useSelector((state) => state.activePlan);

    useEffect(() => {
        console.log(plan)
    }, [plan])

    const postPlanHandler= (inputTitle, inputDescription, inputDescriptionHeight) => {
        // TODO
    }

    const archivePlanHandler = () => {
        // TODO
    }

    return (
        <React.Fragment>
            {/* Show short_term_plan */}
            <section className={classes.card}>
                <div>
                    <h3>Sprint</h3>
                    <button onClick={archivePlanHandler}>Done</button>
                </div>
                {plan.short_term_plans.length === 0 &&
                    <InlineEdit 
                        inputTitle=""
                        inputDescription=""
                        postPlan={postPlanHandler}
                    />
                }
                {plan.short_term_plans.length > 0 &&
                    <InlineEdit 
                        inputTitle={plan.short_term_plans[-1].title}
                        inputDescription={plan.short_term_plans[-1].description}
                        postPlan={postPlanHandler}
                    />
                }
            </section>
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
