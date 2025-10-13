export interface OCRResponse {
    passport_no: string | null;
    passport_type: string | null;
    country_code: string | null;
    reg_no: string | null;
    issuing_office: string | null;
    date_of_issue: string | null;
    date_of_expiry: string | null;
    nik: string | null;
    name: string | null;
    gender: string | null;
    dob: string | null;
    pob: string | null;
    nationality: string | null;
    religion: string | null;
    job: string | null;
    address: string | null;
    subdistrict: string | null;
    village: string | null;
    rtrw: string | null;
}

export interface CountryDataDetail {
    total: number;
    revenue: number;
}

export interface CountryData {
    [key: string]: CountryDataDetail;
}

export interface LoginResponse {
    access_token: string;
}

export interface Option {
    value: string | number;
    label: string;
    disable?: boolean
}