import { axiosInstance } from "../../../util/axios";

export interface EvidenceResponse {
  evidenceId?: string;
  preSignedUrl?: string;
  notes?: string;
}

export interface EvidenceRequest {
  fileName?: string;
  notes?: string;
}

const basePath = "/appeals"

export function getEvidence(appealId: string): Promise<EvidenceResponse> {
  return axiosInstance.get(`${basePath}/${appealId}/evidence/`).then(data => data.data);
};

export function submitEvidence(appealId: string, request: EvidenceRequest): Promise<EvidenceResponse> {
  return axiosInstance.post(`${basePath}/${appealId}/evidence/`, request).then(data => data.data);
}

export function updateEvidence(appealId: string, evidenceId: string, request: EvidenceRequest): Promise<EvidenceResponse> {
  return axiosInstance.put(`${basePath}/${appealId}/evidence/${evidenceId}`, request);
}

export function deleteEvidence(evidenceId: string): Promise<EvidenceResponse> {
  return axiosInstance.delete(`${basePath}/evidence/${evidenceId}`);
};