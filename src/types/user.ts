export interface Profile {
  id: number;
  username: string;
  email: string;
  date: string;
  isBlocked: boolean;
  roles: Role[];
  phoneNumber: string;
}

export type User = Profile;

export interface UserFilters {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  isBlocked?: boolean;
  limit?: number;
  page?: number;
}

export interface UserRolesRequest {
  roles: Role[];
}

export interface UserRequest {
  username?: string;
  email?: string;
  phoneNumber?: string;
}

export type Role = 'ADMIN' | 'USER' | 'MODERATOR';

export type GetUsersResponse = MetaResponse<User>;

interface MetaResponse<T> {
  data: T[];
  meta: {
    totalAmount: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
}
