import React, { PropsWithChildren, useState } from 'react';

import { USE_SUPABASE, supabaseClient } from '../supabase';

import { AuthContext } from './auth';
import { IUserInfo } from './user-info.model';

const localStorageKey = 'token';
const localStorageUserKey = 'user';
const localStorageRefreshKey = 'refresh_token';

export function AuthProvider({ children }: PropsWithChildren) {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem(localStorageKey));
    const [token, setToken] = useState(localStorage.getItem(localStorageKey) ?? '');
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem(localStorageRefreshKey) ?? '');
    const [username, setUsername] = useState(localStorage.getItem(localStorageUserKey) ?? 'Tactician');
    const [shareToken, setShareToken] = useState<string | undefined>('');
    const [userInfo, setUserInfo] = useState<IUserInfo>({ tacticusApiKey: 'key' } as any);

    const login = (accessToken: string, refreshToken?: string) => {
        setIsAuthenticated(true);
        setToken(accessToken);
        setUsername(username);
        localStorage.setItem(localStorageKey, accessToken);

        if (USE_SUPABASE) {
            if (accessToken && refreshToken) {
                supabaseClient().auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
                localStorage.setItem(localStorageRefreshKey, refreshToken);
            } else {
                console.warn(
                    'Both an access token and refresh token is required for Supabase requests, but one was missing.',
                    { accessToken, refreshToken }
                );
            }
        }
    };
    const logout = () => {
        setIsAuthenticated(false);
        setToken('');
        setRefreshToken('');
        setUsername('Tactician');
        localStorage.setItem(localStorageUserKey + 'Old', localStorage.getItem(localStorageUserKey) ?? '');
        localStorage.removeItem(localStorageKey);
        localStorage.removeItem(localStorageUserKey);
        localStorage.removeItem(localStorageRefreshKey);

        if (USE_SUPABASE) {
            supabaseClient().auth.signOut();
        }
    };

    const setUser = (username: string, shareToken?: string) => {
        setUsername(username);
        setShareToken(shareToken);
        localStorage.setItem(localStorageUserKey, username);
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                token,
                refreshToken,
                userInfo,
                username,
                shareToken,
                setUser,
                setUserInfo,
                login,
                logout,
            }}>
            {children}
        </AuthContext.Provider>
    );
}
