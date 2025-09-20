import axios from 'axios';
import { refreshToken as refreshTokenApi } from './auth';
import { tokenService } from '@/utils/tokenService';

export const apiClient = axios.create({
  baseURL: 'https://easydev.club/api/v1',
});

apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = tokenService.getTokens();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
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
      const { refreshToken } = tokenService.getTokens();

      if (!refreshToken) {
        return Promise.reject(error);
      }

      const tokens = await refreshTokenApi({ refreshToken });
      tokenService.setTokens(tokens);

      originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;

      return apiClient(originalRequest);
    } catch (err) {
      tokenService.clearTokens();

      return Promise.reject(err);
    } finally {
      isRefreshingToken = false;
    }
  }
);
