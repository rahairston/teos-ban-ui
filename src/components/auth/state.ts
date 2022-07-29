export interface AuthState {
    accessToken?: string;
    refreshToken?: string;
    email?: string;
    displayName?: string;
    profilePicture?: string;
    roles?: string[];
    loggingIn?: boolean;
    status: 'idle' | 'loading' | 'failed';
}