export interface ProductPriceAgentProduct {
    id_product: string;
    code_product: string;
    nm_product: string;
}

export interface ProductPriceAgentDetail {
    id_product: string;
    code_product: string;
    nm_product: string;
    product_price_agent: number;
    date_update: string;
    link_brosur?: string;
    kurs_bank: number;
    estimasi: number;
}

export interface ProductPriceAgentOptions {
    kurs_usd: number;
}
