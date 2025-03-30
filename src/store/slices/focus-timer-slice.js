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
        stopTimer(state, action) {
            // When stop the timer, show the toal focus time before the next focus start
            state.focusTime = action.payload.seconds;
        }
    }
})

export default focusTimerSlice;
export const focusTimerActions = focusTimerSlice.actions;