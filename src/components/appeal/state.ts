import { BannedByObject } from "../mod/bannedBy/api";
import { EvidenceResponse } from "../mod/evidence/api";
import { JudgementObject } from "../mod/judgement/api";

export interface AppealState {
    appealId?: string;
    twitchUsername?: string;
    discordUsername?: string;
    banType?: string;
    banReason?: string;
    banJustified?: boolean;
    appealReason?: string;
    additionalNotes?: string;
    previousAppealId?: string;
    additionalData?: string;
    prevPageId?: string;
    nextPageId?: string;
    isLoading: boolean;
    isSubmitting: boolean;

    // Admin related
    adminNotes?: string;
    bannedBy?: BannedByObject[];
    judgement?: JudgementObject;
    evidence?: EvidenceResponse[];
}