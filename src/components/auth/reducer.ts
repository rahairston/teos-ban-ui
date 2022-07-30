import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchToken, refreshToken, TokenResponse } from './api';
import { Dispatch } from 'redux';
import { AuthState } from './state';
import { axiosInstance } from '../../util/axios';
import { ErrorResponseWrapper } from '../../constants';
import { error } from '../alert/reducer';

const initialState: AuthState = {
  accessToken: undefined,
  refreshToken: undefined,
  email: undefined,
  displayName: undefined,
  profilePicture: undefined,
  roles: undefined,
  loggingIn: false
};

let timeoutId: NodeJS.Timeout | undefined = undefined;

export const authReducer = createSlice({
  name: 'auth',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    loginError: (state) => {
      state.loggingIn = false;
    },
    loginStart: (state) => {
      state.loggingIn = true
    },
    loginSuccessful: (state, action: PayloadAction<TokenResponse>) => {
      state.loggingIn = false;
      if (action.payload.accessToken) {
        state.accessToken = action.payload.accessToken;
      }
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
      state.roles = action.payload.roles;
      state.email = action.payload.email;
      state.displayName = action.payload.displayName;
      state.profilePicture = action.payload.profileImageUrl;
    },
    logout: () => {
      clearTimeout(timeoutId);
      return initialState;
    },
    refreshSuccessful: (state, action: PayloadAction<TokenResponse>) => {
      if (action.payload.accessToken) {
        state.accessToken = action.payload.accessToken;
      }
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
    }
  }
});

const TokenShared = (data: TokenResponse, isRefresh: boolean) => (dispatch: Dispatch) => {
  axiosInstance.interceptors.request.use(config => {
    if (config && config.headers) {
      config.headers.Authorization = `Bearer ${data.accessToken}`;
    }
    return config;
  })
  timeoutId = setTimeout(() => {
    RefreshAction(data.refreshToken)(dispatch);
  }, data.expiresIn * 1000);
  if (isRefresh) {
    dispatch(refreshSuccessful(data));
  } else {
    dispatch(loginSuccessful(data));
  }
}

export const LoginAction = (authCode: string) => (dispatch: Dispatch) => {
  dispatch(loginStart());
  fetchToken(authCode).then((data: TokenResponse) => {
    TokenShared(data, false)(dispatch);
  }).catch((err: ErrorResponseWrapper) => {
    dispatch(loginError())
    const {response} = err;
    const header = "Unable to Login."
    if (response.status === 500) {
      dispatch(error({
        header,
        message: "Internal Server Error"
      }));
    } else {
      dispatch(error({
        header,
        message: response.data.message
      }));
    }
  });
}

export const RefreshAction = (token: string) => (dispatch: Dispatch) => {
  refreshToken(token).then((data: TokenResponse) => {
    console.log(data);
    TokenShared(data, true)(dispatch);
  }).catch((err: any) => {
    dispatch(loginError())
    const {response} = err;
    const header = "Unable to Refresh Token."
    if (response.status === 500) {
      dispatch(error({
        header,
        message: "Internal Server Error"
      }));
    } else {
      dispatch(error({
        header,
        message: response.data.message
      }));
    }
  });;
}

export const { loginError, loginStart, loginSuccessful, logout, refreshSuccessful } = authReducer.actions;

export default authReducer.reducer;
