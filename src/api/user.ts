import type { Profile } from '@/types/user';
import { apiClient } from './apiClient';

export async function getProfileInfo(): Promise<Profile> {
  const res = await apiClient.get<Profile>('/user/profile');

  return res.data;
}

export async function logout(): Promise<void> {
  await apiClient.post<Profile>('/user/logout');
}
