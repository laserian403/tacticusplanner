export interface IErrorResponse {
    code?: string | null;
    message?: string | null;
    status?: number | null;
}

export interface IApiResponse<TResponse> {
    data: TResponse | null;
    error: string | null;
}
