import { AuthState } from "../components/auth/state";
import { AlertState } from "../components/alert/state";

export interface BanState {
    auth: AuthState;
    alert: AlertState;
}