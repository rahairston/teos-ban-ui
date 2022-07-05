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
      if (action.payload.access_token) {
        state.accessToken = action.payload.access_token;
      }
      if (action.payload.refresh_token) {
        state.refreshToken = action.payload.refresh_token;
      }
      state.email = action.payload.email;
      state.displayName = action.payload.display_name;
      state.profilePicture = action.payload.profile_image_url;
    },
    logout: (state) => {
      state = initialState;
    },
  }
});

export const LoginAction = (authCode: string) => (dispatch: Dispatch) => {
  fetchToken(authCode).then((data: TokenResponse) => {
      setTimeout(() => {
        RefreshAction(data.refresh_token)(dispatch);
      }, data.expires_in * 1000);
      dispatch(loginSuccessful(data));
  });
}

export const RefreshAction = (token: string) => (dispatch: Dispatch) => {
  refreshToken(token).then((data: TokenResponse) => {
      setTimeout(() => {
        RefreshAction(data.refresh_token)(dispatch);
      }, data.expires_in * 1000);
      dispatch(loginSuccessful(data));
  });
}

export const { loginSuccessful, logout } = authReducer.actions;

export default authReducer.reducer;
