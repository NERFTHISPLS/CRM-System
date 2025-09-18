import type { RootState } from '@/types/store';
import { createSelector } from '@reduxjs/toolkit';

const selectAuth = (state: RootState) => state.auth;

export const selectIsAuthenticated = createSelector(
  selectAuth,
  (auth) => auth.isAuthenticated
);
export const selectIsInitialized = createSelector(
  selectAuth,
  (auth) => auth.isInitialized
);
export const selectAuthSignInIsLoading = createSelector(
  selectAuth,
  (auth) => auth.signIn.status === 'pending'
);
export const selectAuthSignInError = createSelector(
  selectAuth,
  (auth) => auth.signIn.error
);
export const selectAuthFetchTokensError = createSelector(
  selectAuth,
  (auth) => auth.fetchTokens.error
);

const selectUser = (state: RootState) => state.user;

export const selectProfile = createSelector(
  selectUser,
  (user) => user.getProfile.data
);
export const selectProfileIsLoading = createSelector(
  selectUser,
  (user) => user.getProfile.status === 'pending'
);
export const selectProfileError = createSelector(
  selectUser,
  (user) => user.getProfile.error
);

const selectTodos = (state: RootState) => state.todos;

export const selectTodosList = createSelector(
  selectTodos,
  (todos) => todos.fetchTodos.data?.data || []
);
export const selectTodosListInfo = createSelector(
  selectTodos,
  (todos) => todos.fetchTodos.data?.info || null
);
export const selectTodosListIsLoading = createSelector(
  selectTodos,
  (todos) => todos.fetchTodos.status === 'pending'
);
export const selectTodosListError = createSelector(
  selectTodos,
  (todos) => todos.fetchTodos.error
);
export const selectTodosFilterValue = createSelector(
  selectTodos,
  (todos) => todos.filterValue
);
