import type { RootState } from '@/types/store';
import { createSelector } from '@reduxjs/toolkit';
import { getAsyncRequestData } from './utils';

const selectAuth = (state: RootState) => state.auth;

export const selectIsAuthenticated = createSelector(
  selectAuth,
  (auth) => auth.isAuthenticated
);
export const selectIsInitialized = createSelector(
  selectAuth,
  (auth) => auth.isInitialized
);
export const selectAuthSignIn = createSelector(selectAuth, (auth) =>
  getAsyncRequestData(auth.signIn)
);
export const selectAuthFetchTokens = createSelector(selectAuth, (auth) =>
  getAsyncRequestData(auth.fetchTokens)
);

const selectUser = (state: RootState) => state.user;

export const selectProfile = createSelector(selectUser, (user) =>
  getAsyncRequestData(user.getProfile)
);

const selectTodos = (state: RootState) => state.todos;

export const selectTodosFilterValue = createSelector(
  selectTodos,
  (todos) => todos.filterValue
);
export const selectTodosList = createSelector(selectTodos, (todos) =>
  getAsyncRequestData(todos.fetchTodos)
);
