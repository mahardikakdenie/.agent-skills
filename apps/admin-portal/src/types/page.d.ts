export interface Page {
    page: number;
    limit: number;
    isCanNext: boolean;
}

export interface Meta {
    page: number;
    limit: number;
    pageTotal: number;
    total: number;
}