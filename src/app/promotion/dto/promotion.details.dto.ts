export interface EmbeddedDiscountProduct {
    product_id: string;
    product_name: string;
}

export interface EmbeddedDiscountInsurance {
    insurance_id: string;
    insurance_name: string;
}

export interface EmbeddedDiscountPlan {
    plan_id: string;
}

export interface EmbeddedDiscountChannel {
    channel_id: string;
    channel_name: string;
}

export interface PromotionDetails {
    campaign_id: string;
    name: string;
    type: string;
    start_date: string;
    end_date: string;
    value: number;
    active: boolean;
    value_currency: string;
    minimum_amount: number;
    maximum_amount: number;
    embedded_discount_channels: EmbeddedDiscountChannel[];
    embedded_discount_insurances: EmbeddedDiscountInsurance[];
    embedded_discount_plans: EmbeddedDiscountPlan[];
    embedded_discount_products: EmbeddedDiscountProduct[];
}


export interface ChannelResponse {
    id: string;
    name: string;
}

export interface InsuranceResponse {
    id: string;
    name: string;
}

export interface ProductResponse {
    data: [Product]
}

export interface PlanResponse {
    id: string;
    name: string;
}

export interface Product {
    id: string;
    name: string;
}

export interface ErrorModalProps {
    isOpen: boolean;
    message: string;
    onClose: () => void;
}

export interface Voucher {
    id: number;
    code: string;
    usage_limit: number;
}