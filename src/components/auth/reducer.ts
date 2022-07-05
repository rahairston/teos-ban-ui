import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchToken, refreshToken, TokenResponse } from './api';
import { Dispatch } from 'redux';
import { BanState } from '../../redux/state';

const initialState: BanState = {
  accessToken: undefined,
  refreshToken: undefined,
  email: undefined,
  displayName: undefined,
  profilePicture: undefined,
  status: 'idle',
};

export const authReducer = createSlice({
  name: 'auth',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    loginSuccessful: (state, action: PayloadAction<TokenResponse>) => {
      state.loggingIn = false;
      if (action.payload.accessToken) {
        state.accessToken = action.payload.accessToken;
      }
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
      state.email = action.payload.email;
      state.displayName = action.payload.displayName;
      state.profilePicture = action.payload.profileImageUrl;
    },
    logout: (state) => {
      state = initialState;
    },
  }
});

export const LoginAction = (authCode: string) => (dispatch: Dispatch) => {
  fetchToken(authCode).then((data: TokenResponse) => {
      setTimeout(() => {
        RefreshAction(data.refreshToken)(dispatch);
      }, data.expiresIn * 1000);
      dispatch(loginSuccessful(data));
  });
}

export const RefreshAction = (token: string) => (dispatch: Dispatch) => {
  refreshToken(token).then((data: TokenResponse) => {
      setTimeout(() => {
        RefreshAction(data.refreshToken)(dispatch);
      }, data.expiresIn * 1000);
      dispatch(loginSuccessful(data));
  });
}

export const { loginSuccessful, logout } = authReducer.actions;

export default authReducer.reducer;
