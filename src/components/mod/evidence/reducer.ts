import { createSlice } from '@reduxjs/toolkit';
import { EvidenceRequest, EvidenceResponse, submitEvidence, getEvidence, deleteEvidence, updateEvidence, submitEvidenceToS3, deleteEvidenceFromS3} from './api';
import { Dispatch } from 'redux';
import { EvidenceState } from './state';
import { ErrorResponseWrapper } from '../../../constants';
import { error, success } from '../../alert/reducer';
import { updateEvidenceFromModal, deleteEvidenceFromModal } from '../../appeal/reducer';

const initialState: EvidenceState = {
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
    deleteStart: (state) => {
      state.isLoading = true;
    },
    submitOrLoadError: (state) => {
      state.isLoading = false;
      state.isSubmitting = false;
    }
  }
});

export const submit = (appealId: string, request: EvidenceRequest, file: Blob) => (dispatch: Dispatch) => {
  dispatch(submitStart());
  submitEvidence(appealId, request).then((response: EvidenceResponse) => {
    submitEvidenceToS3(response.preSignedUrl, file);
    if (!!response.evidenceId) {
      getEvidence(appealId, response.evidenceId).then((response: EvidenceResponse) => {dispatch(updateEvidenceFromModal(response))})
    }
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

export const update = (appealId: string, evidenceId: string, request: EvidenceRequest, file?: Blob) => (dispatch: Dispatch) => {
  dispatch(submitStart());
  updateEvidence(appealId, evidenceId, request).then((response: EvidenceResponse) => {
    if (!!file) { // in case just the notes are changed
      submitEvidenceToS3(response.preSignedUrl, file);
    }
    getEvidence(appealId, evidenceId).then((response: EvidenceResponse) => {dispatch(updateEvidenceFromModal(response))});
    dispatch(submitComplete());
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

export const onDelete = (appealId: string, evidenceId: string) => (dispatch: Dispatch) => {
  dispatch(deleteStart());
  deleteEvidence(appealId, evidenceId).then((response: EvidenceResponse) => {
    deleteEvidenceFromS3(response.preSignedUrl);
    dispatch(submitComplete());
    dispatch(deleteEvidenceFromModal(response))
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


export const { clearEvidence, deleteStart, submitStart, submitComplete, submitOrLoadError } = evidenceReducer.actions;

export default evidenceReducer.reducer;
