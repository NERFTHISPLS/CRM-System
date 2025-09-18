import type { Token } from '@/types/auth';

const REFRESH_TOKEN_KEY = 'refreshToken';

class TokenService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  public setTokens({ accessToken, refreshToken }: Token): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  public getTokens(): Partial<Token> {
    if (!this.refreshToken) {
      this.refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    }

    return {
      accessToken: this.accessToken ?? undefined,
      refreshToken: this.refreshToken ?? undefined,
    };
  }

  public clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

export const tokenService = new TokenService();
