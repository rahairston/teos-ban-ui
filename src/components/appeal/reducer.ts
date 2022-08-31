import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppealRequest, AppealResponse, submitAppeal, getAppeal, deleteAppeal, updateAppeal} from './api';
import * as _ from 'lodash';
import { Dispatch } from 'redux';
import { AppealState } from './state';
import { ErrorResponseWrapper } from '../../constants';
import { error, success } from '../alert/reducer';
import { EvidenceResponse } from '../mod/evidence/api';

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
  prevPageId: undefined,
  nextPageId: undefined,
  isLoading: false,
  isSubmitting: false
};

export const appealReducer = createSlice({
  name: 'appeal',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    clearAppeal: () => {
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
      state = _.mergeWith(state, action.payload, (a, b) => _.isArray(b) ? b : undefined);
    },
    updateEvidenceFromModal: (state, action: PayloadAction<EvidenceResponse>) => {
      const index = _.findIndex(state.evidence, (evidence: EvidenceResponse) => {
        return !!evidence.evidenceId && evidence.evidenceId === action.payload.evidenceId
      })

      if (index !== -1 && !!state.evidence) {
        state.evidence[index] = action.payload;
      } else if (!!state.evidence) {
        state.evidence.push(action.payload);
      }
    },
    deleteEvidenceFromModal: (state, action: PayloadAction<EvidenceResponse>) => {
      if (!!state.evidence && !!action.payload.evidenceId) {
        state.evidence = _.filter(state.evidence, (e: EvidenceResponse) => { return e.evidenceId !== action.payload.evidenceId })
      }
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
        message: "Error"
      }));
    }
  });
}

export const update = (appealId: string, request: AppealRequest) => (dispatch: Dispatch) => {
  dispatch(submitStart());
  updateAppeal(appealId, request).then(() => {
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
  deleteAppeal(appealId).then(() => {
    dispatch(clearAppeal());
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


export const { clearAppeal, deleteStart, submitStart, submitComplete,
  loadingStart, loadingComplete, submitOrLoadError, updateEvidenceFromModal, deleteEvidenceFromModal } = appealReducer.actions;

export default appealReducer.reducer;
