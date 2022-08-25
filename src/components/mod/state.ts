import { BannedByOnject, EvidenceResponse } from "./api";

export interface EvidenceState {
  evidence: EvidenceResponse[];
  bannedBy: BannedByOnject[];
  isLoading: boolean;
  isSubmitting: boolean;
}