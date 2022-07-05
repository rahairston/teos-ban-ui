import axios from "axios";
import BuildUrl from "build-url";
import {OAUTH_STATE_KEY} from "../../constants";
import * as _ from "lodash";

const {REACT_APP_API_URL, REACT_APP_BASE_PATH} = process.env;

export interface TokenResponse {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  email: string;
  displayName: string;
  profileImageUrl: string;
}

export function fetchToken(authCode: string): Promise<TokenResponse> {
  const nonce = sessionStorage.getItem(OAUTH_STATE_KEY);
  const tokenUrl = BuildUrl(`${REACT_APP_API_URL}${REACT_APP_BASE_PATH}/auth/token`, {
    queryParams: {
      code: authCode,
      nonce: nonce ? nonce : ""
    }
  });
    return axios.get(tokenUrl);
};

export function refreshToken(refreshToken: string): Promise<TokenResponse> {
    return axios.get(`${REACT_APP_API_URL}${REACT_APP_BASE_PATH}/auth/token?refresh=${refreshToken}`);
};
  