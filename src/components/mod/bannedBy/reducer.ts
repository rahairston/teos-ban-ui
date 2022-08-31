import { createSlice } from '@reduxjs/toolkit';
import { BannedByObject, submitBannedBy } from './api';
import { Dispatch } from 'redux';
import { BannedByState } from './state';
import { ErrorResponseWrapper } from '../../../constants';
import { error, success } from '../../alert/reducer';

const initialState: BannedByState = {
  isLoading: false,
  isSubmitting: false
};

export const bannedByReducer = createSlice({
  name: 'bannedBy',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    clearBannedBy: () => {
      return initialState;
    },
    submitStart: (state) => {
      state.isSubmitting = true
    },
    submitComplete: (state) => {
      state.isSubmitting = false;
    },
    submitOrLoadError: (state) => {
      state.isLoading = false;
      state.isSubmitting = false;
    }
  }
});

export const submit = (appealId: string, request: BannedByObject[]) => (dispatch: Dispatch) => {
  dispatch(submitStart());
  submitBannedBy(appealId, request).then(() => {
    dispatch(submitComplete());
    dispatch(success({
      header: "Updated Appeal",
      message: "Added Banned By Data."
    }));
  }).catch((err: ErrorResponseWrapper) => {
    dispatch(submitOrLoadError());
    const {response} = err;
    const header = "Unable to submit Banned By data."
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

export const { clearBannedBy, submitStart, submitComplete, submitOrLoadError } = bannedByReducer.actions;

export default bannedByReducer.reducer;
