import { configureStore } from '@reduxjs/toolkit';
import activePlanSlice from './active-plan-slice';

const store = configureStore({
    reducer: {
        activePlan: activePlanSlice.reducer
    }
})

export default store;



/* ========== Learning ========== */
/* Wrap up all Slices into one store */
// configureStore from @reduxjs/toolkit help wrap up
// all slices into one store and we then provide the one
// store to the subscriber