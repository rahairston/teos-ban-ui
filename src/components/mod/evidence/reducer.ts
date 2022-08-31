import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EvidenceRequest, EvidenceResponse, submitEvidence, getEvidence, deleteEvidence, updateEvidence} from './api';
import * as _ from 'lodash';
import { Dispatch } from 'redux';
import { EvidenceState } from './state';
import { ErrorResponseWrapper } from '../../../constants';
import { error, success } from '../../alert/reducer';

const initialState: EvidenceState = {
  evidence: [],
  isLoading: false,
  isSubmitting: false
};

export const evidenceReducer = createSlice({
  name: 'evidence',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    clearEvidence: () => {
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
    loadingComplete: (state, action: PayloadAction<EvidenceResponse>) => {
      state.isLoading = false;
      state.evidence.push(action.payload);
    },
    deleteStart: (state) => {
      state.isLoading = true;
    },
    submitOrLoadError: (state) => {
      state.isLoading = false;
      state.isSubmitting = false;
    }
  }
});

export const submit = (appealId: string, request: EvidenceRequest) => (dispatch: Dispatch) => {
  dispatch(submitStart());
  submitEvidence(appealId, request).then((response: EvidenceResponse) => {
    dispatch(success({
      header: "Created Evidence",
      message: "You can view it "
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
  getEvidence(appealId).then((data: EvidenceResponse) => {
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
        message: "Error"
      }));
    }
  });
}

export const update = (appealId: string, evidenceId: string, request: EvidenceRequest) => (dispatch: Dispatch) => {
  dispatch(submitStart());
  updateEvidence(appealId, evidenceId, request).then(() => {
    dispatch(submitComplete());
    dispatch(success({
      header: "Updated Appeal",
      message: "You can view it ",
      link: `/appeals/${appealId}`,
      linkText: "here"
    }));
  }).catch((err: ErrorResponseWrapper) => {
    dispatch(submitOrLoadError());
    const {response} = err;
    const header = `Unable to update appeal with ID ${appealId}`
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

export const deleteApp = (appealId: string) => (dispatch: Dispatch) => {
  dispatch(deleteStart());
  deleteEvidence(appealId).then(() => {
    dispatch(clearEvidence());
    dispatch(success({
      header: "Deleted",
      message: "Appeal was deleted."
    }))
  }).catch((err: ErrorResponseWrapper) => {
    dispatch(submitOrLoadError());
    const {response} = err;
    const header = `Unable to delete appeal with ID ${appealId}`
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


export const { clearEvidence, deleteStart, submitStart, submitComplete, loadingStart, loadingComplete, submitOrLoadError } = evidenceReducer.actions;

export default evidenceReducer.reducer;
