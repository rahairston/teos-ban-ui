import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchToken, refreshToken, TokenResponse } from './api';
import { Dispatch } from 'redux';
import { AuthState } from './state';
import { axiosInstance } from '../../util/axios';
import { ErrorResponseWrapper } from '../../constants';
import { clearAllAlerts, error } from '../alert/reducer';
import { clearAppeal } from '../appeal/reducer';
import { clearAppeals } from '../appeals/reducer';

const initialState: AuthState = {
  accessToken: undefined,
  refreshToken: undefined,
  expiresAt: undefined,
  email: undefined,
  displayName: undefined,
  profilePicture: undefined,
  roles: undefined,
  loggingIn: false
};

// Cookie expires in 30 minutes so we refresh token on 29
const refreshTimeout = 29 * 60 * 1000;

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
      state.expiresAt = Math.floor(Date.now() / 1000) + action.payload.expiresIn
      state.displayName = action.payload.displayName;
      state.profilePicture = action.payload.profileImageUrl;
    },
    logout: () => {
      clearTimeout(timeoutId);
      return initialState;
    },
    refreshSuccessful: (state, action: PayloadAction<TokenResponse>) => {
      state.expiresAt = Math.floor(Date.now() / 1000) + action.payload.expiresIn;
      if (action.payload.accessToken) {
        state.accessToken = action.payload.accessToken;
      }
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
    }
  }
});

export const TokenShared = (data: TokenResponse) => (dispatch: Dispatch) => {
  axiosInstance.interceptors.request.use(config => {
    if (config && config.headers) {
      config.headers.Authorization = `Bearer ${data.accessToken}`;
    }
    return config;
  });
  axiosInstance.interceptors.response.use(response => {
      return response;
  }, error => {
    if (error.response.status === 401) {
      LogoutAction(dispatch);
      dispatch(error({
        header: "Token Expired",
        message: "Please log in again."
      }));
    }
    return error;
  });
  
  timeoutId = setTimeout(() => {
    RefreshAction(data.refreshToken)(dispatch);
  }, refreshTimeout);
}

export const LoginAction = (authCode: string) => (dispatch: Dispatch) => {
  dispatch(loginStart());
  fetchToken(authCode).then((data: TokenResponse) => {
    TokenShared(data)(dispatch);
    dispatch(loginSuccessful(data));
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
    TokenShared(data)(dispatch);
    dispatch(refreshSuccessful(data));
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
  });
}

export const LogoutAction = (dispatch: Dispatch) => {
  dispatch(clearAllAlerts());
  dispatch(clearAppeal());
  dispatch(clearAppeals());
  dispatch(logout());
}

export const { loginError, loginStart, loginSuccessful, logout, refreshSuccessful } = authReducer.actions;

export default authReducer.reducer;
