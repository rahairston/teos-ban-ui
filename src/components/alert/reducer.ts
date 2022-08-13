import { createSlice, PayloadAction } from '@reduxjs/toolkit';
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
  }
});

export const { info, clearInfo, error, clearError, success, clearSuccess } = alertReducer.actions;

export default alertReducer.reducer;
