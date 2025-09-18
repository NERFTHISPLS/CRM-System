import { getProfileInfo, logout as logoutApi } from '@/api/user';
import type { Profile } from '@/types/user';
import { getErrorMessage } from '@/utils/helpers';
import { tokenService } from '@/utils/tokenService';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface UserState {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  isLoading: false,
  error: null,
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
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    } finally {
      tokenService.clearTokens();
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.profile = null;
        state.isLoading = false;
        state.error = action.payload ?? 'Unknown error occurred';
      })

      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, () => {
        return initialState;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Unknown error';
      });
  },
});

export default userSlice.reducer;
