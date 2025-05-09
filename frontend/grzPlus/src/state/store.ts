import { configureStore } from "@reduxjs/toolkit";
import authorizationReducer from "./authorization/authorizationSlice"

export const store = configureStore({
    reducer: {
        authorization: authorizationReducer
    }
})

export type Rootstate = ReturnType<typeof store.getState>
export type AppDispatch = ReturnType<typeof store.dispatch> 