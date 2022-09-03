import { createSlice } from '@reduxjs/toolkit';
import { JudgementObject, submitJudgement } from './api';
import { Dispatch } from 'redux';
import { JudgementState } from './state';
import { ErrorResponseWrapper } from '../../../constants';
import { error, success } from '../../alert/reducer';

const initialState: JudgementState = {
  isSubmitting: false
};

export const judgementReducer = createSlice({
  name: 'judgement',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    clearJudgement: () => {
      return initialState;
    },
    submitStart: (state) => {
      state.isSubmitting = true
    },
    submitComplete: (state) => {
      state.isSubmitting = false;
    },
    submitOrLoadError: (state) => {
      state.isSubmitting = false;
    }
  }
});

export const submit = (appealId: string, request: JudgementObject) => (dispatch: Dispatch) => {
  dispatch(submitStart());
  submitJudgement(appealId, request).then(() => {
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

export const { clearJudgement, submitStart, submitComplete, submitOrLoadError } = judgementReducer.actions;

export default judgementReducer.reducer;
