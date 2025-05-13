import React from 'react';

const TodayPlanSummary = (props) => {
    let expectedTimeToday = props.expected_time_checked_today;
    let remainingPlannedTime = 0;

    if (props.today_plans !== undefined) {
        for(const today_plan of props.today_plans) {
            expectedTimeToday += today_plan.expected_hours * 60 * 60 + today_plan.expected_minutes * 60
            remainingPlannedTime += today_plan.expected_hours * 60 * 60 + today_plan.expected_minutes * 60;
        }
    }

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


    return (
        <React.Fragment>
            <div>Total Planned Time: {secondsToHMS(expectedTimeToday)}</div>
            <div>Remaining Planned Time: {secondsToHMS(remainingPlannedTime)}</div>
            <div>Total Used Time: {secondsToHMS(props.used_time)}</div>
        </React.Fragment>
        
    )
}

export default TodayPlanSummary;