import { createContext, useContext } from 'react';

import { IUserInfo } from './user-info.model';

interface IAuthContext {
    username: string;
    shareToken?: string;
    isAuthenticated: boolean;
    token: string;
    refreshToken: string;
    userInfo: IUserInfo;

    login(accessToken: string, refreshToken?: string): void;

    logout(): void;

    setUserInfo(userInfo: IUserInfo): void;

    setUser(username: string, shareToken?: string): void;
}

const localStorageKey = 'token';

export const AuthContext = createContext<IAuthContext>({
    username: 'Tactician',
    isAuthenticated: !!localStorage.getItem(localStorageKey),
    token: localStorage.getItem(localStorageKey) ?? '',
    refreshToken: localStorage.getItem('refresh_token') ?? '',
    userInfo: {} as any,

    login(): void {},

    logout(): void {},

    setUser(): void {},

    setUserInfo(): void {},
});

export function useAuth() {
    return useContext(AuthContext);
}
