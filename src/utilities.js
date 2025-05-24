/**
 * @description isToday is called by multiple functions, make sure the
 *              parameter plan_date is in format yyyy-mm-dd
 * @param {*} plan_date
 * @returns boolean
 */
const isToday = (plan_date) => {
    if (!plan_date) {
        return false;
    }

    // Convert yyyy-mm-dd to mm/dd/yyyy for local time parsing
    let formatted_plan_date;
    if (plan_date) {
        const [yy, mm, dd] = plan_date.split("-");
        formatted_plan_date = `${mm}/${dd}/${yy}`;
    }

    // Get current date and time
    const now = new Date();
    let cur_date = now.toLocaleDateString();
    let cur_date_to_time = new Date(cur_date).getTime();
    let plan_date_to_time = new Date(formatted_plan_date).getTime();

    // If before 2:00am, treat as previous day
    if (now.getHours() < 2) {
        const prev = new Date(now);
        prev.setDate(now.getDate() - 1);
        cur_date = prev.toLocaleDateString();
        cur_date_to_time = new Date(cur_date).getTime();
    }

    if (plan_date_to_time && plan_date_to_time - cur_date_to_time === 0) {
        return true;
    }
    return false;
}

const isTomorrow = (plan_date) => {
    if(plan_date) {
        const year = plan_date.split("-")[0];
        const month = plan_date.split("-")[1];
        const day = plan_date.split("-")[2];

        const date = new Date();
        date.setDate(date.getDate() + 1);

        if(Number(year) === date.getFullYear() &&
           Number(month) === date.getMonth()+1 &&   // Note: getMonth() will return 0 for January
           Number(day) === date.getDate()) {
            return true
        }
    }
    return false
}

export { isToday, isTomorrow };

/* ========== Learning ========== */
/* Export functions */
// We can export function like what is done above
// Or we can export function like
// export const isToday = (plan_date) => {...}

/* if(string_variable) */
// if(string_variable) basically can check empty string, undefined, null, ...
// if( string_variable === "") can only check empty string