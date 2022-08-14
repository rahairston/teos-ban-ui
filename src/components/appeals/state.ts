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
    isLoading: boolean;
    isSubmitting: boolean;

    // TODO - never mind but keeping in here for ideas later -> dispath from API to evidennce/judgement reducers with these
    // evidence?: EvidenceData[];
    // judgement?: JudgementData;
}