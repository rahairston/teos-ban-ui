import { AppealResponse } from "../appeal/api";

export interface AppealsState {
    appeals: AppealResponse[];
    totalPages: number;
    totalSize: number;
    isLoading: boolean;
}