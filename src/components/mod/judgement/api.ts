import { axiosInstance } from "../../../util/axios";

export enum JudgementStatus {
  PENDING = "Pending", // user submits
  REVIEWING = "Reviewing", // evidence applied
  UNBANNED = "Unbanned", // decision made
  BAN_UPHELD = "Ban Upheld" // decision made
}

export interface JudgementObject {
  status: JudgementStatus;
  resubmitAfterDate?: number;
  notes?: string;
}


const basePath = "/appeals"

export function submitJudgement(appealId: string, request: JudgementObject): Promise<void> {
  return axiosInstance.put(`${basePath}/${appealId}/judgement/`, request);
}