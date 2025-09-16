import type { RootState } from '@/types/store';

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectAuthIsLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectIsInitialized = (state: RootState) =>
  state.auth.isInitialized;

export const selectTodos = (state: RootState) => state.todos.todos;
export const selectTodosInfo = (state: RootState) => state.todos.info;
export const selectTodosIsLoading = (state: RootState) => state.todos.isLoading;
export const selectTodosError = (state: RootState) => state.todos.error;
export const selectTodosFilterValue = (state: RootState) =>
  state.todos.filterValue;
