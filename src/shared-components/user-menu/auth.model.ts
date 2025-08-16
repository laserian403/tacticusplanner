export interface ILoginResponse {
    accessToken: string;
    refreshToken?: string;
}

export interface IRegistrationResponse {
    id: number;
    username: string;
}
