import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EvidenceRequest, EvidenceResponse, submitEvidence, getEvidence, deleteEvidence, updateEvidence, submitEvidenceToS3, deleteEvidenceFromS3} from './api';
import { Dispatch } from 'redux';
import { EvidenceState } from './state';
import { ErrorResponseWrapper } from '../../../constants';
import { updateEvidenceFromModal, deleteEvidenceFromModal } from '../../appeal/reducer';

const initialState: EvidenceState = {
  error: "",
  success: "",
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
    clearError: (state) => {
      state.error = ""
    },
    clearSucess: (state) => {
      state.success = ""
    },
    submitStart: (state) => {
      state.isSubmitting = true
    },
    submitComplete: (state, action: PayloadAction<string>) => {
      state.success = action.payload;
      state.isSubmitting = false;
    },
    submitOrLoadError: (state, action: PayloadAction<string>) => {
      state.isSubmitting = false;
      state.error = action.payload;
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
    dispatch(submitComplete("Created Evidence"));
  }).catch((err: ErrorResponseWrapper) => {
    const {response} = err;
    if (response.status === 500) {
      dispatch(submitOrLoadError("Internal Server Error"));
    } else {
      dispatch(submitOrLoadError(response.data.message));
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
    dispatch(submitComplete("Updated Evidence"));
  }).catch((err: ErrorResponseWrapper) => {
    const {response} = err;
    if (response.status === 500) {
      dispatch(submitOrLoadError("Internal Server Error"));
    } else {
      dispatch(submitOrLoadError(response.data.message));
    }
  });
}

export const onDelete = (appealId: string, evidenceId: string) => (dispatch: Dispatch) => {
  dispatch(submitStart());
  deleteEvidence(appealId, evidenceId).then((response: EvidenceResponse) => {
    deleteEvidenceFromS3(response.preSignedUrl);
    dispatch(submitComplete("Deleted Evidence"));
    dispatch(deleteEvidenceFromModal(response))
  }).catch((err: ErrorResponseWrapper) => {
    const {response} = err;
    if (response.status === 500) {
      dispatch(submitOrLoadError("Internal Server Error"));
    } else {
      dispatch(submitOrLoadError(response.data.message));
    }
  });
}


export const { clearEvidence, clearError, clearSucess, submitStart, submitComplete, submitOrLoadError } = evidenceReducer.actions;

export default evidenceReducer.reducer;
