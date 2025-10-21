export interface Customer {
    id?: string;
    name: string;
    email: string;
    phone: string;
    account: string;
}

export interface RequestAddCustomer {
    channel: string;
    customer: Customer;
    category: string;
    package: string;
    quantity: number;
    search_params: {};
    participant: DetailGadget | any,
}

export interface DetailGadget {
    imei: string;
    type_product: string;
    brand_name: string;
}