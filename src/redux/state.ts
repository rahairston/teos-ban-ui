export interface BanState {
    accessToken?: string;
    refreshToken?: string;
    email?: string;
    displayName?: string;
    profilePicture?: string;
    loggingIn?: boolean;
    status: 'idle' | 'loading' | 'failed';
}