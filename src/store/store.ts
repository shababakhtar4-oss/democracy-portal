import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice';
import authReducer from './slices/authSlice';
import votersReducer from './slices/votersSlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    api: apiSlice.reducer,
    auth: authReducer,
    voters: votersReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;