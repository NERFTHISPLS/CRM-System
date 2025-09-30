import { getProfileInfo, logout as logoutApi } from '@/api/user';
import type { Profile } from '@/types/user';
import { getErrorMessage } from '@/utils/helpers';
import { tokenService } from '@/utils/tokenService';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  addAsyncBuilderCases,
  initAsyncParticle,
  type AsyncParticle,
} from '../utils';

export interface UserState {
  isLoading: boolean;
  error: string | null;
  getProfile: AsyncParticle<Profile>;
  logout: AsyncParticle<void>;
}

const initialState: UserState = {
  isLoading: false,
  error: null,
  getProfile: initAsyncParticle<Profile>(),
  logout: initAsyncParticle<void>(),
};

export const getProfile = createAsyncThunk<
  Profile,
  void,
  { rejectValue: string }
>('/user/getProfile', async (_, { rejectWithValue }) => {
  try {
    return await getProfileInfo();
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  '/user/logout',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      await logoutApi();
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    } finally {
      tokenService.clearTokens();
      dispatch(clearProfile());
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearProfile(state) {
      state.getProfile.data = null;
      state.getProfile.error = null;
      state.getProfile.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    addAsyncBuilderCases(builder, getProfile, 'getProfile');
    addAsyncBuilderCases(builder, logout, 'logout');
  },
});

export const { clearProfile } = userSlice.actions;

export default userSlice.reducer;
