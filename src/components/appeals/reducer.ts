import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppealRequest, AppealResponse, submitAppeal, getAppeal} from './api';
import * as _ from 'lodash';
import { Dispatch } from 'redux';
import { AppealState } from './state';
import { ErrorResponseWrapper } from '../../constants';
import { error, success } from '../alert/reducer';

const initialState: AppealState = {
  appealId: undefined,
  twitchUsername: undefined,
  discordUsername: undefined,
  banReason: undefined,
  banType: undefined,
  banJustified: undefined,
  appealReason: undefined,
  additionalNotes: undefined,
  previousAppealId: undefined,
  additionalData: undefined,
  isLoading: false,
  isSubmitting: false
};

export const appealReducer = createSlice({
  name: 'appeal',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    clear: () => {
      return initialState;
    },
    submitStart: (state) => {
      state.isSubmitting = true
    },
    submitComplete: (state) => {
      state.isSubmitting = false;
    },
    loadingStart: (state) => {
      state.isLoading = true
    },
    loadingComplete: (state, action: PayloadAction<AppealResponse>) => {
      state.isLoading = false;
      state = _.merge(state, action.payload);
    },
    submitOrLoadError: (state) => {
      state.isLoading = false;
      state.isSubmitting = false;
    }
  }
});

export const submit = (request: AppealRequest) => (dispatch: Dispatch) => {
  dispatch(submitStart());
  submitAppeal(request).then((location: string) => {
    dispatch(success({
      header: "Created Appeal",
      message: "You can view it ",
      link: `/appeals/${location}`,
      linkText: "here"
    }))
    dispatch(submitComplete());
  }).catch((err: ErrorResponseWrapper) => {
    dispatch(submitOrLoadError());
    const {response} = err;
    const header = "Unable to submit appeal."
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

export const load = (appealId: string) => (dispatch: Dispatch) => {
  dispatch(loadingStart());
  getAppeal(appealId).then((data: AppealResponse) => {
    dispatch(loadingComplete(data));
  }).catch((err: ErrorResponseWrapper) => {
    dispatch(submitOrLoadError());
    const {response} = err;
    const header = `Unable to get appeal with ID ${appealId}`
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

export const { clear, submitStart, submitComplete, loadingStart, loadingComplete, submitOrLoadError } = appealReducer.actions;

export default appealReducer.reducer;
