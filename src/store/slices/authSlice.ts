import {
  refreshToken as refreshTokenApi,
  signIn as signInApi,
} from '@/api/auth';
import type { AuthData, Token } from '@/types/auth';
import { getErrorMessage } from '@/utils/helpers';
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { tokenService } from '@/utils/tokenService';
import {
  addAsyncBuilderCases,
  initAsyncParticle,
  type AsyncParticle,
} from '../utils';

export interface AuthState {
  isAuthenticated: boolean;
  isInitialized: boolean;
  signIn: AsyncParticle;
  fetchTokens: AsyncParticle;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  signIn: initAsyncParticle(),
  fetchTokens: initAsyncParticle(),
};

export const fetchTokens = createAsyncThunk<
  Token,
  string,
  { rejectValue: string }
>('auth/fetchTokens', async (refreshToken, { rejectWithValue }) => {
  try {
    const data = await refreshTokenApi({ refreshToken });
    tokenService.setTokens(data);

    return data;
  } catch (err) {
    tokenService.clearTokens();

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
    tokenService.setTokens(data);

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
    setIsAuthenticated(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
    },
  },
  extraReducers: (builder) => {
    addAsyncBuilderCases(builder, signIn, 'signIn');
    addAsyncBuilderCases(builder, fetchTokens, 'fetchTokens');
  },
});

export const { setIsInitialized, setIsAuthenticated } = authSlice.actions;

export default authSlice.reducer;
