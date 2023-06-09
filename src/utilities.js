const isToday = (plan_date) => {
    const cur_date = new Date().toISOString().slice(0,10)
    const cur_date_to_time = new Date(cur_date).getTime()
    const plan_date_to_time = new Date(plan_date).getTime()
    if(plan_date_to_time - cur_date_to_time === 0) {
        return true
    }
    return false
}

export { isToday };