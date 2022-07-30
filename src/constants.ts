export const clientId    = "er7cd9kmc6jgg0pi59q7otzkfek6i7";
export const redirectUri = "http://localhost:3000/redirect";
export const OAUTH_STATE_KEY = 'react-use-oauth2-state-key';

export interface ErrorResponseWrapper {
    response: ErrorResponse;
}
export interface ErrorResponse {
    data: ErrorData;
    status: number;
};

export interface ErrorData {
    message: string;
    status: number;
}