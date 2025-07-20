/* ========== import React and React hooks ========== */
import React from 'react';

/* ========== import React components ========== */
import DailyPlans from '../../Plans/DailyPlans/DailyPlans';

/* ========== import css ========== */
import 'bootstrap/dist/css/bootstrap.min.css';

const Sprint = () => {
    return (
        <React.Fragment>
            {/* Separation between Navigation and DailyPlans */}
            <div style={{height: "20px"}} />

            <DailyPlans />
        </React.Fragment>
    )
}

export default Sprint
