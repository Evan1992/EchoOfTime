import React from 'react';

/* ========== import other libraries ========== */
import { isToday } from '../../../utilities';

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
            const is_today = isToday(json_object.date)
            if(is_today) {
                expectedTimeSum += json_object.expected_hours * 60 * 60 + json_object.expected_minutes * 60
            }
        }
        return secondsToHMS(expectedTimeSum)
    }

    const calUsedTimeSum = (plans) => {
        let usedTimeSum = 0
        for (let json_object of plans.values()){
            const is_today = isToday(json_object.date)
            if(is_today) {
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