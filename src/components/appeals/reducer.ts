import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppealFilters, getAppeals} from './api';
import { Dispatch } from 'redux';
import * as _ from 'lodash';
import { AppealsState } from './state';
import { ErrorResponseWrapper } from '../../constants';
import { error } from '../alert/reducer';
import { AppealResponse } from '../appeal/api';

const initialState: AppealsState = {
  appeals: [],
  totalPages: 0,
  totalSize: 0,
  isLoading: false
};

export const appealsReducer = createSlice({
  name: 'appeals',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    clearAppeals: () => {
      return initialState;
    },
    loadingStart: (state) => {
      state.isLoading = true
    },
    loadingComplete: (state, action: PayloadAction<AppealResponse[]>) => {
      state.isLoading = false;
      state = _.merge(state, action.payload);
    },
    loadError: (state) => {
      state.isLoading = false;
    }
  }
});

export const load = (filters: AppealFilters) => (dispatch: Dispatch) => {
  dispatch(loadingStart());
  getAppeals(filters).then((data: AppealResponse[]) => {
    dispatch(loadingComplete(data));
  }).catch((err: ErrorResponseWrapper) => {
    dispatch(loadError());
    const {response} = err;
    const header = `Unable to get appeals`
    if (response.status === 500) {
      dispatch(error({
        header,
        message: "Internal Server Error"
      }));
    } else {
      dispatch(error({
        header,
        message: "Error"
      }));
    }
  });
}

export const { clearAppeals, loadingStart, loadingComplete, loadError } = appealsReducer.actions;

export default appealsReducer.reducer;
