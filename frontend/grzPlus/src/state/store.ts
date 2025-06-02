import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import authorizationReducer from "./authorization/authorizationSlice";

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['authorization'] // Only persist the authorization slice
};

const rootReducer = combineReducers({
    authorization: authorizationReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
});

export const persistor = persistStore(store);

export type Rootstate = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;