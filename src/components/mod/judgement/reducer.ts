import { createSlice } from '@reduxjs/toolkit';
import { JudgementObject, submitJudgement } from './api';
import { Dispatch } from 'redux';
import { JudgementState } from './state';
import { ErrorResponseWrapper } from '../../../constants';
import { errorDispatch, successDispatch } from '../../alert/reducer';

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
    successDispatch({
      header: "Updated Appeal",
      message: "Judgement submitted."
    })(dispatch);
  }).catch((err: ErrorResponseWrapper) => {
    dispatch(submitOrLoadError());
    const {response} = err;
    const header = "Unable to submit Judgement."
    if (response.status === 500) {
      errorDispatch({
        header,
        message: "Internal Server Error"
      })(dispatch);
    } else {
      errorDispatch({
        header,
        message: response.data.message
      })(dispatch);
    }
  });
}

export const { clearJudgement, submitStart, submitComplete, submitOrLoadError } = judgementReducer.actions;

export default judgementReducer.reducer;
