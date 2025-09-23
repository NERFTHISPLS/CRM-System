import type {
  GetUsersResponse,
  User,
  UserFilters,
  UserRequest,
} from '@/types/user';
import {
  addAsyncBuilderCases,
  initAsyncParticle,
  type AsyncParticle,
} from '../utils';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getUserById,
  getUsers,
  updateUserData,
  removeUser as removeUserApi,
} from '@/api/admin';
import { getErrorMessage } from '@/utils/helpers';

export interface AdminState {
  users: AsyncParticle<GetUsersResponse>;
  selectedUser: AsyncParticle<User>;
}

const initialState: AdminState = {
  users: initAsyncParticle<GetUsersResponse>(),
  selectedUser: initAsyncParticle<User>(),
};

export const fetchUsers = createAsyncThunk<
  GetUsersResponse,
  UserFilters,
  { rejectValue: string }
>('admin/fetchUsers', async (filters, { rejectWithValue }) => {
  try {
    const data = await getUsers(filters);

    return data;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const fetchUserById = createAsyncThunk<
  User,
  User['id'],
  { rejectValue: string }
>('admin/fetchUserById', async (id, { rejectWithValue }) => {
  try {
    const data = await getUserById(id);

    return data;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const updateUser = createAsyncThunk<
  User,
  { id: User['id']; fields: UserRequest },
  { rejectValue: string }
>('admin/updateUser', async ({ id, fields }, { rejectWithValue }) => {
  try {
    const data = await updateUserData(id, fields);

    return data;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const removeUser = createAsyncThunk<
  void,
  User['id'],
  { rejectValue: string }
>('admin/removeUser', async (id, { rejectWithValue }) => {
  try {
    await removeUserApi(id);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    addAsyncBuilderCases(builder, fetchUsers, 'users');
    addAsyncBuilderCases(builder, fetchUserById, 'selectedUser');
  },
});

export default adminSlice.reducer;
