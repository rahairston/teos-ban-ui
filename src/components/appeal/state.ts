import { BannedByObject } from "../mod/bannedBy/api";

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
    judgement?: any; // todo
    prevPageId?: string;
    nextPageId?: string;
    isLoading: boolean;
    isSubmitting: boolean;

    // TODO - never mind but keeping in here for ideas later -> dispath from API to evidennce/judgement reducers with these
    bannedBy?: BannedByObject[];
    // evidence?: EvidenceData[];
    // judgement?: JudgementData;
}