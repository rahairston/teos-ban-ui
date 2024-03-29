import { axiosInstance } from "../../util/axios";
import { BannedByObject } from "../mod/bannedBy/api";
import { EvidenceResponse } from "../mod/evidence/api";
import { JudgementObject } from "../mod/judgement/api";

export enum BanType {
  TWITCH = "TWITCH",
  DISCORD = "DISCORD",
  BOTH = "BOTH"
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
    adminNotes?: string;
    judgement?: JudgementObject;
    evidence?: EvidenceResponse[];
    bannedBy?: BannedByObject[]
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
  adminNotes?: string;
}

const basePath = "/appeals"

export function getAppeal(appealId: string): Promise<AppealResponse> {
  return axiosInstance.get(`${basePath}/${appealId}`).then(data => data.data);
};

export function submitAppeal(request: AppealRequest): Promise<string> {
  return axiosInstance.post(`${basePath}/`, request).then(data => data.headers.location);
}

export function updateAppeal(appealId: string, request: AppealRequest): Promise<void> {
  return axiosInstance.put(`${basePath}/${appealId}`, request);
}

export function deleteAppeal(appealId: string): Promise<void> {
  return axiosInstance.delete(`${basePath}/${appealId}`);
};