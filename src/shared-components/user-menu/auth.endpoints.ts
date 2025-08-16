import { IErrorResponse, makeApiCall } from '@/fsd/5-shared/api';
import { USE_SUPABASE, supabaseClient } from '@/fsd/5-shared/supabase';

import { ILoginResponse, IRegistrationResponse } from './auth.model';

export const registerUser = async (username: string, password: string) => {
    let result;
    if (USE_SUPABASE) {
        result = await registerSupabaseUser(username, password, supabaseClient());
    } else {
        result = await makeApiCall<IRegistrationResponse, IErrorResponse>('POST', 'RegisterUser', {
            username,
            password,
        } as any);
    }
    const { data, error } = result;
    if (error) throw error;
    return data;
};

export const loginUser = async (username: string, password: string) => {
    let result;
    if (USE_SUPABASE) {
        result = await loginSupabaseUser(username, password, supabaseClient());
    } else {
        result = await makeApiCall<ILoginResponse, IErrorResponse>('POST', 'LoginUser', {
            username,
            password,
        } as any);
    }

    const { data, error } = result;
    if (error) throw error;
    return data;
};

async function registerSupabaseUser(
    username: string,
    password: string,
    supabase: ReturnType<typeof supabaseClient> | undefined
) {
    if (typeof supabase === 'undefined') throw new Error('Unable to create Supabase client to register user.');
    return supabase.auth.signUp({ email: username, password });
}

async function loginSupabaseUser(
    username: string,
    password: string,
    supabase: ReturnType<typeof supabaseClient> | undefined
) {
    if (typeof supabase === 'undefined') throw new Error('Unable to create Supabase client to login user.');
    const { data, error } = await supabase.auth.signInWithPassword({ email: username, password });
    if (error) return { error };
    return {
        data: {
            id: data.user?.id,
            accessToken: data.session?.access_token,
            refreshToken: data.session?.refresh_token,
        },
    };
}
