const REFRESH_TOKEN_KEY = 'refreshToken';

export const storage = {
  setRefreshToken(refreshToken: string): void {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  clearTokens(): void {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};
