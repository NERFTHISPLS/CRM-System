import type {
  AuthData,
  Profile,
  RefreshToken,
  Token,
  UserRegistration,
} from '@/types/auth';
import { apiClient } from './apiClient';

export async function signUp(newUserData: UserRegistration): Promise<Profile> {
  const res = await apiClient.post<Profile>('/auth/signup', newUserData);

  return res.data;
}

export async function signIn(authData: AuthData): Promise<Token> {
  const res = await apiClient.post<Token>('/auth/signin', authData);

  return res.data;
}

export async function refreshToken(
  refreshTokenData: RefreshToken
): Promise<Token> {
  const res = await apiClient.post<Token>('/auth/refresh', refreshTokenData);

  return res.data;
}
