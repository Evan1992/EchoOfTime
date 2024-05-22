import { createSlice } from '@reduxjs/toolkit'; // reduxjs/toolkit already includes redux


// const initialState = {
//     title: null,
//     description: null,
//     date: null,
//     short_term_plans: []
// }

const initialState = {
    title: "",
    description: "",
    date: null,
    short_term_plans: []
}

const activePlanSlice = createSlice({
    name: 'activePlan',
    initialState, // Modern javascript syntax, it's equavilent to initialState: initialState
    reducers: {
        addPlan(state, action) {
            state.title = action.payload.title;
            state.description = action.payload.description;
            state.date = action.payload.date;
            state.short_term_plans = action.payload.short_term_plans;
        }
    }
})

export default activePlanSlice;



/* ========== Learning ========== */
/* No asynchronous operation within reducer function */
// No asynchronous operation within reducer function, like
// http request. Instead, there are two ways to perform http
// reuqest, one is "useEffect()"", another one is "action creator thunk"