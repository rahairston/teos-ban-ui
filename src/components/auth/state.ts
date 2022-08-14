export interface AuthState {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    email?: string;
    displayName?: string;
    profilePicture?: string;
    roles?: string[];
    loggingIn?: boolean;
}