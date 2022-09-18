export interface RequestParams {
    [key: string | number]: any
}

export interface RequestResponse<T = any> {
    code: number;
    data: T;
    msg?: string;
}