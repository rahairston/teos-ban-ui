import { axiosInstance } from "../../../util/axios";

export interface EvidenceResponse {
  evidenceId?: string;
  preSignedUrl?: string;
  notes?: string;
}

export interface EvidenceRequest {
  appealId: string;
  fileName?: string;
  notes?: string;
}

const basePath = "/appeals"

export function getEvidence(appealId: string): Promise<EvidenceResponse> {
  return axiosInstance.get(`${basePath}/${appealId}/evidence`).then(data => data.data);
};

export function submitEvidence(request: EvidenceRequest): Promise<string> {
  return axiosInstance.post(`${basePath}/${request.appealId}/evidence/`, request).then(data => data.headers.location);
}

export function updateEvidence(evidenceId: string, request: EvidenceRequest): Promise<void> {
  return axiosInstance.put(`${basePath}/${evidenceId}`, request);
}

export function deleteEvidence(evidenceId: string): Promise<void> {
  return axiosInstance.delete(`${basePath}/${evidenceId}`);
};