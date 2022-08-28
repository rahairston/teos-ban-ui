import { EvidenceResponse } from "./api";

export interface EvidenceState {
  evidence: EvidenceResponse[];
  isLoading: boolean;
  isSubmitting: boolean;
}