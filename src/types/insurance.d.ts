export interface Insurance {
    id: string;
    sum_insured: string | null;
    premium: string | number;
    currency: string;
    quantity: string;
    plan: {
        id: string;
        name: string;
    };
    product: {
        id: string;
        name: string;
    };
    insurance: {
        name: string;
        logo_url: string;
        currencies: Currency[];
    };
    original_price: number;
    discount: number;
}

interface Currency {
    currency_from: string;
    currency_to: string;
    value: string | number
}