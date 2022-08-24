import { axiosInstance } from "../../util/axios";

export enum BanType {
  TWITCH = "TWITCH",
  DISCORD = "DISCORD",
  BOTH = "BOTH"
}

export interface JudgementResponse {
  judgementId?: string;
  status?: string;
}
export interface AppealResponse {
    appealId: string;
    twitchUsername: string;
    discordUsername?: string;
    banType: string;
    banReason: string;
    banJustified: boolean;
    appealReason: string;
    additionalNotes?: string;
    previousAppealId?: string;
    additionalData?: string;
    judgement?: JudgementResponse;
}

export interface AppealRequest {
  twitchUsername: string;
  discordUsername?: string;
  banType: string;
  banReason: string;
  banJustified: boolean;
  appealReason: string;
  additionalNotes?: string;
  previousAppealId: string;
  additionalData?: string;
}

const basePath = "/appeals"

export function getAppeal(appealId: string): Promise<AppealResponse> {
  return axiosInstance.get(`${basePath}/${appealId}`).then(data => data.data);
};

export function submitAppeal(request: AppealRequest): Promise<string> {
  return axiosInstance.post(`${basePath}/`, request).then(data => data.headers.location);
}

export function deleteAppeal(appealId: string): Promise<AppealResponse> {
  return axiosInstance.delete(`${basePath}/${appealId}`).then(data => data.data);
};