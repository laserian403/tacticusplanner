import { GenericAbortSignal } from 'axios';

import { IPersonalData2 } from '@/models/interfaces';

import { callApi, IErrorResponse, makeApiCall } from '@/fsd/5-shared/api';
import { USE_SUPABASE, supabaseClient } from '@/fsd/5-shared/supabase';

import { IUserDataResponse } from './user.model';

export const getUserDataApi = async () => {
    let result;
    if (USE_SUPABASE) {
        result = await getSupabaseUserData(supabaseClient());
    } else {
        result = await makeApiCall<IUserDataResponse, IErrorResponse>('GET', 'users/me');
    }
    const { data, error } = result;
    if (error) throw error;
    return { data, error: null };
};

export const setUserDataApi = async (userData: IPersonalData2, signal?: GenericAbortSignal) => {
    let result;
    const modifiedDateTicks = localStorage.getItem('TP-ModifiedDateTicks') ?? '';
    if (USE_SUPABASE) {
        result = await setSupabaseUserData(supabaseClient(), userData, {
            'TP-ModifiedDateTicks': modifiedDateTicks,
        });
    } else {
        try {
            result = {
                data: await callApi<IPersonalData2, IErrorResponse, IUserDataResponse>(
                    'PUT',
                    'users/me',
                    userData,
                    {
                        'TP-ModifiedDateTicks': modifiedDateTicks,
                    },
                    signal
                ),
            };
        } catch (err) {
            result = { error: err };
        }
    }
    const { data, error } = result;
    if (error) throw error;
    return { data };
};

async function getSupabaseUserData(supabase: ReturnType<typeof supabaseClient>) {
    return supabase.functions.invoke('me', { method: 'GET' });
}

async function setSupabaseUserData(
    supabase: ReturnType<typeof supabaseClient>,
    userData: IPersonalData2,
    headers: { [key: string]: string }
) {
    return supabase.functions.invoke('me', { method: 'PUT', headers, body: userData });
}
