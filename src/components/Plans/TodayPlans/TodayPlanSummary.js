import React from 'react';

const TodayPlanSummary = (props) => {
    const formatToTwoDigits = (n) => {
        if(n < 10 ){
            return `0${n}`;
        } else {
            return `${n}`;
        }
    }

    const secondsToHMS = (seconds) => {
        let hour  = (seconds / 3600) >> 0;
        let minute  = ((seconds % 3600) / 60) >> 0;
        let second  = seconds % 60;
        
        hour   = formatToTwoDigits(hour);
        minute = formatToTwoDigits(minute);
        second = formatToTwoDigits(second);

        return `${hour}:${minute}:${second}`
    }

    const calExpectedTimeSum = (plans) => {
        let expectedTimeSum = 0
        for (let json_object of plans.values()){
            const cur_date = new Date().toISOString().slice(0,10)
            const cur_date_to_time = new Date(cur_date).getTime()
            const plan_date = json_object.date
            const plan_date_to_time = new Date(plan_date).getTime()
            // If the plan is set to today
            if(plan_date_to_time - cur_date_to_time === 0) {
                expectedTimeSum += json_object.expected_hours * 60 * 60 + json_object.expected_minutes * 60
            }
        }
        return secondsToHMS(expectedTimeSum)
    }

    const calUsedTimeSum = (plans) => {
        let usedTimeSum = 0
        for (let json_object of plans.values()){
            const cur_date = new Date().toISOString().slice(0,10)
            const cur_date_to_time = new Date(cur_date).getTime()
            const plan_date = json_object.date
            const plan_date_to_time = new Date(plan_date).getTime()
            // If the plan is set to today
            if(plan_date_to_time - cur_date_to_time === 0) {
                usedTimeSum += json_object.seconds
            }
        }
        return secondsToHMS(usedTimeSum)
    }

    return (
        <React.Fragment>
            <h4>Summary</h4>
            <div>Expected Time Sum: {calExpectedTimeSum(props.all_plans)}</div>
            <div>Used Time Sum: {calUsedTimeSum(props.all_plans)}</div>
        </React.Fragment>
    )
}

export default TodayPlanSummary