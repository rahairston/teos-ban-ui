import axios from "axios";

const {REACT_APP_API_URL, REACT_APP_BASE_PATH} = process.env;

export interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  email: string;
  display_name: string;
  profile_image_url: string;
}

export function fetchToken(authCode: string): Promise<TokenResponse> {
    return axios.get(`${REACT_APP_API_URL}${REACT_APP_BASE_PATH}/auth/token?code=${authCode}`);
};

export function refreshToken(refreshToken: string): Promise<TokenResponse> {
    return axios.get(`${REACT_APP_API_URL}${REACT_APP_BASE_PATH}/auth/token?refresh=${refreshToken}`);
};
  