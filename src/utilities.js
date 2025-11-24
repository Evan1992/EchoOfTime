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
    if (!plan_date) {
        return false;
    }

    const [year, month, day] = plan_date.split("-");

    const now = new Date();

    // If before 2:00am, treat tomorrow as today + 1 day
    let tomorrow = new Date(now);
    if (now.getHours() < 2) {
        tomorrow.setDate(now.getDate());
    } else {
        tomorrow.setDate(now.getDate() + 1);
    }

    if (
        Number(year) === tomorrow.getFullYear() &&
        Number(month) === tomorrow.getMonth() + 1 && // getMonth() is 0-based
        Number(day) === tomorrow.getDate()
    ) {
        return true;
    }
    return false;
}

const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export { isToday, isTomorrow, getTodayDateString };

/* ========== Learning ========== */
/* Export functions */
// We can export function like what is done above
// Or we can export function like
// export const isToday = (plan_date) => {...}

/* if(string_variable) */
// if(string_variable) basically can check empty string, undefined, null, ...
// if( string_variable === "") can only check empty string