import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlise";
import clientStateReducer from "./clientStates";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    clientState: clientStateReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
