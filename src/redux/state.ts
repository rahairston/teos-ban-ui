import { AuthState } from "../components/auth/state";
import { AlertState } from "../components/alert/state";
import { AppealState } from "../components/appeal/state";
import { AppealsState } from "../components/appeals/state";
import { BannedByState } from "../components/mod/bannedBy/state";
import { EvidenceState } from "../components/mod/evidence/state";

export interface BanState {
    auth: AuthState;
    alert: AlertState;
    appeal: AppealState;
    appeals: AppealsState;
    bannedBy: BannedByState;
    evidence: EvidenceState;
}