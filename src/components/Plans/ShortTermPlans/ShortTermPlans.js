/* ========== import React components ========== */
import NewShortTermPlan from '../NewPlan/NewShortTermPlan';


const ShortTermPlans = (props) => {
    return (
        <NewShortTermPlan long_term_plan_id={props.long_term_plan_id} />
    )
}

export default ShortTermPlans