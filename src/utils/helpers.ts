import type { Profile, Role } from '@/types/user';
import { AxiosError } from 'axios';

export function getErrorMessage(err: unknown): string {
  if (err instanceof AxiosError) {
    return `${err.message}. ${err.response?.data ?? ''}`;
  }

  if (err instanceof Error) {
    return err.message;
  }

  if (typeof err === 'string') {
    return err;
  }

  return 'Failed to create task';
}

export function isAdmin(profileRoles: Profile['roles']): boolean {
  const allowedRoles = new Set<Role>(['ADMIN', 'MODERATOR']);

  return profileRoles.some((role) => allowedRoles.has(role));
}
