export interface ActionResponse<T> {
    error: boolean;
    message: string;
    data?: T
}