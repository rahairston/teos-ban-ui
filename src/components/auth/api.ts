import BuildUrl from "build-url";
import {OAUTH_STATE_KEY} from "../../constants";
import { axiosInstance } from "../../util/axios";

export interface TokenResponse {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  email: string;
  displayName: string;
  profileImageUrl: string;
  roles: string[];
}

export function fetchToken(authCode: string): Promise<TokenResponse> {
  const nonce = sessionStorage.getItem(OAUTH_STATE_KEY);
  const tokenUrl = BuildUrl("/auth/token", {
    queryParams: {
      code: authCode,
      nonce: nonce ? nonce : ""
    }
  });
  return axiosInstance.get(tokenUrl).then(data => data.data);
};

export function refreshToken(refreshToken: string): Promise<TokenResponse> {
    return axiosInstance.get(`/auth/token?refresh=${refreshToken}`).then(data => data.data);
};
  