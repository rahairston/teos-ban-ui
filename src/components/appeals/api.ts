import BuildUrl from "build-url";
import { axiosInstance } from "../../util/axios";
import { AppealResponse } from "../appeal/api";

export interface AppealFilters {
  pageCount: number;
  pageSize: number;
  username?: string;
  type?: string;
  status?: string;
}

const basePath = "/appeals"

export function getAppeals(filters: AppealFilters): Promise<AppealResponse[]> {
  const appealUrl = BuildUrl(`${basePath}/`, {
    queryParams: filters as any
  });
  return axiosInstance.get(appealUrl).then(data => data.data);
};
  