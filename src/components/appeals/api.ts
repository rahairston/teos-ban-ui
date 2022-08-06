import axios from "axios";
import BuildUrl from "build-url";
import {OAUTH_STATE_KEY} from "../../constants";
import { axiosInstance } from "../../util/axios";

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
}

export interface AppealRequest {
  twitchUsername: string;
  discordUsername?: string;
  banType: string;
  banReason: string;
  banJustified: boolean;
  appealReason: string;
  additionalNotes: string;
  previousAppealId: string;
  additionalData: string;
}

const basePath = "/appeals"

export function getAppeal(appealId: string): Promise<AppealResponse> {
  return axiosInstance.get(`${basePath}/${appealId}`).then(data => data.data);
};

export function submitAppeal(request: AppealRequest): Promise<string> {
  return axiosInstance.post(`${basePath}/`, request).then(data => data.headers.location);
}
  