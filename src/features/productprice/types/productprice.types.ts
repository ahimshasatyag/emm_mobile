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
}

export type ProductPriceFormData = Omit<ProductPrice, 'code_product' | 'nm_product' | 'nm_product_brand' | 'waktu' | 'aksi' | 'flag_active'> & {
    id_product: string;
    product_price: string;
    product_price_agent: string;
};

export interface ProductPriceState {
    prices: ProductPrice[];
    isLoading: boolean;
    error: string | null;
}
