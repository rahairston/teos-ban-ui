import axios from "axios";
import { axiosInstance } from "../../../util/axios";

export interface EvidenceResponse {
  evidenceId?: string;
  preSignedUrl: string;
  notes?: string;
}

export interface EvidenceRequest {
  fileName?: string;
  notes?: string;
}

const basePath = "/appeals"

export function getEvidence(appealId: string, evidenceId: string): Promise<EvidenceResponse> {
  return axiosInstance.get(`${basePath}/${appealId}/evidence/${evidenceId}`).then(data => data.data);
};

export function submitEvidence(appealId: string, request: EvidenceRequest): Promise<EvidenceResponse> {
  return axiosInstance.post(`${basePath}/${appealId}/evidence/`, request).then(data => data.data);
}

export function updateEvidence(appealId: string, evidenceId: string, request: EvidenceRequest): Promise<EvidenceResponse> {
  return axiosInstance.put(`${basePath}/${appealId}/evidence/${evidenceId}`, request).then(data => data.data);
}

export function deleteEvidence(appealId: string, evidenceId: string): Promise<EvidenceResponse> {
  return axiosInstance.delete(`${basePath}/${appealId}/evidence/${evidenceId}`).then(data => data.data);
};

export function submitEvidenceToS3(url: string, file: Blob): Promise<any> {
  return file.arrayBuffer().then((buffer: ArrayBuffer) => {
    return axios.put(url, buffer, { headers: { "Content-Type": "application/x-www-form-urlencoded" } })
  })
}

export function deleteEvidenceFromS3(url: string): Promise<any> {
  return axios.delete(url)
}