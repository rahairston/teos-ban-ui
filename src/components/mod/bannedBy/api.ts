import { axiosInstance } from "../../../util/axios";

export enum BannedByAction {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE"
}

export interface BannedByObject {
  [key: string]: string | undefined;
  bannedById?: string;
  name?: string;
  banDate?: string;
  action?: BannedByAction;
}


const basePath = "/appeals"


export function submitBannedBy(appealId: string, request: BannedByObject[]): Promise<void> {
  return axiosInstance.put(`${basePath}/${appealId}/bannedBy/`, {request});
}