import { storage } from '@/utils/storage';
import axios from 'axios';
import { refreshToken as refreshTokenApi } from './auth';

export const apiClient = axios.create({
  baseURL: 'https://easydev.club/api/v1',
});

apiClient.interceptors.request.use(
  (config) => {
    const token = storage.getAccessToken();
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
      storage.setTokens(tokens);

      originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;

      return apiClient(originalRequest);
    } catch (err) {
      storage.clearTokens();
      return Promise.reject(err);
    } finally {
      isRefreshingToken = false;
    }
  }
);
