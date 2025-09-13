import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    // todos: todosReducer,
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
