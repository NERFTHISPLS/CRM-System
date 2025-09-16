import {
  refreshToken as refreshTokenApi,
  signIn as signInApi,
} from '@/api/auth';
import type { AuthData, Token } from '@/types/auth';
import { getErrorMessage } from '@/utils/helpers';
import { storage } from '@/utils/storage';
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { getProfile, logout } from './userSlice';

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  accessToken: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitialized: false,
  accessToken: null,
};

export const getAccessToken = createAsyncThunk<
  Token,
  string,
  { rejectValue: string }
>('auth/getAccessToken', async (refreshToken, { rejectWithValue }) => {
  try {
    const data = await refreshTokenApi({ refreshToken });
    storage.setRefreshToken(data.refreshToken);

    return data;
  } catch (err) {
    storage.clearTokens();

    return rejectWithValue(getErrorMessage(err));
  }
});

export const signIn = createAsyncThunk<
  Token,
  AuthData,
  { rejectValue: string }
>('auth/signIn', async (authData: AuthData, { rejectWithValue }) => {
  try {
    const data = await signInApi(authData);
    storage.setRefreshToken(data.refreshToken);

    return data;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsInitialized(state, action: PayloadAction<boolean>) {
      state.isInitialized = action.payload;
    },
    setAccessToken(state, action: PayloadAction<string | null>) {
      state.accessToken = action.payload;
      state.isAuthenticated = Boolean(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.isAuthenticated = true;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Unknown error occurred';
      })

      .addCase(getAccessToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAccessToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.error = null;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(getAccessToken.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload ?? 'Unknown error occurred';
        state.accessToken = null;
      })

      .addCase(getProfile.rejected, (state, action) => {
        state.error = action.payload ?? 'Unknown error occurred';
      })

      .addCase(logout.fulfilled, () => {
        return { ...initialState, isInitialized: true };
      })
      .addCase(logout.rejected, (_, action) => {
        return {
          ...initialState,
          error: action.payload ?? 'Unknown error occurred',
          isInitialized: true,
        };
      });
  },
});

export const { setIsInitialized, setAccessToken } = authSlice.actions;

export default authSlice.reducer;
