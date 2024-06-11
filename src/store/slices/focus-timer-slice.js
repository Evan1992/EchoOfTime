import { createSlice } from "@reduxjs/toolkit";


const focusTimerSlice = createSlice({
    name: 'focusTimer',
    initialState: {
        focusTime: 0
    },
    reducers: {
        startTimer(state, action) {
            state.focusTime = action.payload.seconds;
        },
        stopTimer(state) {
            state.focusTime = 0;
        }
    }
})

export default focusTimerSlice;
export const focusTimerActions = focusTimerSlice.actions;