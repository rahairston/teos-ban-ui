import { AuthState } from "../components/auth/state";
import { AlertState } from "../components/alert/state";
import { AppealState } from "../components/appeal/state";
import { AppealsState } from "../components/appeals/state";

export interface BanState {
    auth: AuthState;
    alert: AlertState;
    appeal: AppealState;
    appeals: AppealsState;
}