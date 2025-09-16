import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import todosReducer from './slices/todosSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    todos: todosReducer,
  },
});
