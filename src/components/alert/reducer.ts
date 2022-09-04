import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Dispatch } from 'redux';
import { AlertState } from './state';

const initialState: AlertState = {
  info: undefined,
  infoHeader: undefined,
  infoMessage: undefined,
  success: undefined,
  successHeader: undefined,
  successLink: undefined,
  successLinkText: undefined,
  successMessage: undefined,
  error: undefined,
  errorHeader: undefined,
  errorMessage: undefined
};

const alertTimeout = 5 * 1000;

export interface AlertPayload {
  header: string;
  message: string;
  link?: string;
  linkText?: string;
}

export const alertReducer = createSlice({
  name: 'alert',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    info: (state, action: PayloadAction<AlertPayload>) => {
      state.info = true;
      state.infoHeader = action.payload.header;
      state.infoMessage = action.payload.message;
    },
    clearInfo: (state) => {
      state.info = false;
      state.infoHeader = undefined;
      state.infoMessage = undefined;
    },
    error: (state, action: PayloadAction<AlertPayload>) => {
      state.error = true;
      state.errorHeader = action.payload.header;
      state.errorMessage = action.payload.message;
    },
    clearError: (state) => {
      state.error = false;
      state.errorHeader = undefined;
      state.errorMessage = undefined;
    },
    success: (state, action: PayloadAction<AlertPayload>) => {
      state.success = true;
      state.successHeader = action.payload.header;
      state.successMessage = action.payload.message;
      state.successLink = action.payload.link;
      state.successLinkText = action.payload.linkText;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.successHeader = undefined;
      state.successMessage = undefined;
      state.successLink = undefined;
      state.successLinkText = undefined;
    },
    clearAllAlerts: () => {
      return initialState;
    }
  }
});

export const successDispatch = (request: AlertPayload) => (dispatch: Dispatch) => {
  dispatch(success(request));
  setTimeout(() => {
    dispatch(clearSuccess())
  }, alertTimeout);
}

export const infoDispatch = (request: AlertPayload) => (dispatch: Dispatch) => {
  dispatch(info(request));
  setTimeout(() => {
    dispatch(clearInfo())
  }, alertTimeout);
}

export const errorDispatch = (request: AlertPayload) => (dispatch: Dispatch) => {
  dispatch(error(request));
  setTimeout(() => {
    dispatch(clearError())
  }, alertTimeout);
}

export const { info, clearInfo, error, clearError, success, clearSuccess, clearAllAlerts } = alertReducer.actions;

export default alertReducer.reducer;
