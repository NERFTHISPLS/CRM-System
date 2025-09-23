import type {
  GetUsersResponse,
  User,
  UserFilters,
  UserRequest,
} from '@/types/user';
import { apiClient } from './apiClient';

export async function getUsers(
  filters: UserFilters
): Promise<GetUsersResponse> {
  const res = await apiClient.get<GetUsersResponse>('/admin/users', {
    params: filters,
  });

  return res.data;
}

export async function getUserById(id: User['id']): Promise<User> {
  const res = await apiClient.get<User>(`/admin/users/${id}`);

  return res.data;
}

export async function updateUserData(
  id: User['id'],
  fieldsToUpdate: UserRequest
): Promise<User> {
  const res = await apiClient.put<User>(`/admin/users/${id}`, fieldsToUpdate);

  return res.data;
}

export async function removeUser(id: User['id']): Promise<void> {
  await apiClient.delete<void>(`/admin/users/${id}`);
}
