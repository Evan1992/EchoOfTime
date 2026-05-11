import { createSlice } from "@reduxjs/toolkit";


const focusTimerSlice = createSlice({
    name: 'focusTimer',
    initialState: {
        focusTime: 0,
        sessionElapsed: 0,          // focusTime - activationBaseSeconds (always in sync, no drift)
        isTimerActive: false,
        timerHolder: null,          // plan id that owns the running timer
        startTime: null,            // Date.now() of the current base period (reset on tab-switch)
        baseSeconds: 0,             // seconds the plan had when the current base period started
        activationBaseSeconds: 0,   // seconds the plan had when the timer was first activated (never reset)
    },
    reducers: {
        activateTimer(state, action) {
            state.isTimerActive = true;
            state.timerHolder = action.payload.planId;
            state.startTime = action.payload.startTime;
            state.baseSeconds = action.payload.baseSeconds;
            state.activationBaseSeconds = action.payload.baseSeconds;
            state.focusTime = action.payload.baseSeconds;
            state.sessionElapsed = 0;
        },
        deactivateTimer(state, action) {
            state.isTimerActive = false;
            state.timerHolder = null;
            state.startTime = null;
            state.baseSeconds = 0;
            state.activationBaseSeconds = 0;
            state.focusTime = action.payload.seconds;
            state.sessionElapsed = 0;
        },
        tickTimer(state, action) {
            state.focusTime = action.payload.seconds;
            state.sessionElapsed = action.payload.seconds - state.activationBaseSeconds;
        },
        // Called on tab-switch (component unmount while timer is running).
        // Saves the current accumulated time as the new base without stopping the timer.
        resetTimerBase(state, action) {
            state.baseSeconds = action.payload.baseSeconds;
            state.startTime = action.payload.startTime;
            // activationBaseSeconds intentionally not reset — keeps sessionElapsed in sync
        },
    }
})

export default focusTimerSlice;
export const focusTimerActions = focusTimerSlice.actions;
