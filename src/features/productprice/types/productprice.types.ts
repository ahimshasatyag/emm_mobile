export interface ProductPrice {
    id_product: string;
    code_product: string;
    nm_product: string;
    nm_product_brand: string;
    product_price: string;
    product_price_agent: string;
    waktu: string;
    aksi?: string;
    flag_active: string;
    kurs?: string;
    est_idr?: string;
    delivery_term?: string;
    kurs_bank?: string; // added to match backend response sometimes
}

export interface ProductPriceFormData {
    id_product: string;
    product_price: string;
    product_price_agent: string;
    kurs_bank: string;
    delivery_term: string;
    flag_active?: string;
}

export interface SupportDataProduct {
    id_product: string;
    code_product: string;
    nm_product: string;
}

export interface ProductPriceSupportData {
    data_product: SupportDataProduct[];
}

export interface ProductPriceState {
    prices: ProductPrice[];
    supportData: ProductPriceSupportData | null;
    isLoading: boolean;
    error: string | null;
}
