import { storage } from '@/utils/storage';
import axios from 'axios';
import { refreshToken as refreshTokenApi } from './auth';
import { setAccessToken } from '@/store/slices/authSlice';
import type { AppStore } from '@/types/store';

export const apiClient = axios.create({
  baseURL: 'https://easydev.club/api/v1',
});

export function setupInterceptors(store: AppStore): void {
  apiClient.interceptors.request.use(
    (config) => {
      const token = store.getState().auth.accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (err) => Promise.reject(err)
  );

  let isRefreshingToken = false;

  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (!originalRequest) {
        return Promise.reject(error);
      }

      if (error?.response?.status !== 401 || originalRequest?._retry) {
        return Promise.reject(error);
      }

      if (isRefreshingToken) {
        return Promise.reject(error);
      }

      isRefreshingToken = true;
      originalRequest._retry = true;

      try {
        const refreshToken = storage.getRefreshToken();

        if (!refreshToken) {
          return Promise.reject(error);
        }

        const tokens = await refreshTokenApi({ refreshToken });
        storage.setRefreshToken(tokens.refreshToken);
        store.dispatch(setAccessToken(tokens.accessToken));

        originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;

        return apiClient(originalRequest);
      } catch (err) {
        storage.clearTokens();
        store.dispatch(setAccessToken(null));

        return Promise.reject(err);
      } finally {
        isRefreshingToken = false;
      }
    }
  );
}
