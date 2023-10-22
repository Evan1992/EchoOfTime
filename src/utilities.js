/**
 * @description isToday is called by multiple functions, make sure the
 *              parameter plan_date is in format yyyy-mm-dd
 * @param {*} plan_date
 * @returns boolean
 */
const isToday = (plan_date) => {
    /**
     * date's format is yyyy-mm-dd, somehow, new Date(date) will use UTC to parse it,
     * while if date's format is mm/dd/yyyy, new Date(date) will use local time zone to parse it.
     * As a result, we should convert yyyy-mm-dd to mm/dd/yyyy first
     */
    let formatted_plan_date
    if(plan_date) {
        const splitted_plan_date = plan_date.split("-")
        const yy = splitted_plan_date[0]
        const mm = splitted_plan_date[1]
        const dd = splitted_plan_date[2]
        formatted_plan_date = mm.concat("/", dd, "/", yy)
    }

    const cur_date = new Date().toLocaleDateString()
    const cur_date_to_time = new Date(cur_date).getTime()
    const plan_date_to_time = new Date(formatted_plan_date).getTime()
    if(plan_date_to_time && plan_date_to_time - cur_date_to_time === 0) {
        return true
    }
    return false
}

export { isToday };

/* ========== Learning ========== */
/* Export functions */
// We can export function like what is done above
// Or we can export function like
// export const isToday = (plan_date) => {...}

/* if(string_variable) */
// if(string_variable) basically can check empty string, undefined, null, ...
// if( string_variable === "") can only check empty string