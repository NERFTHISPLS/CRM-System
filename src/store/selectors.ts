import type { RootState } from '@/types/store';

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectAuthIsLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectIsInitialized = (state: RootState) =>
  state.auth.isInitialized;
