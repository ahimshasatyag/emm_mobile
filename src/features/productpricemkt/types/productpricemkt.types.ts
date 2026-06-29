// Product untuk dropdown pencarian
export interface ProductPriceMktProduct {
    id_product: string;
    code_product: string;
    nm_product: string;
}

// Detail harga produk untuk marketing (price agent + kurs)
export interface ProductPriceMktDetail {
    id_product: string;
    code_product: string;
    nm_product: string;
    product_price: string;         // harga USD
    product_price_agent: string;   // harga agen USD
    date_update: string | null;    // tanggal update harga
    kurs_bank: string;             // kurs IDR
    estimasi: string;              // estimasi IDR (agent * kurs)
    link_brosur: string | null;
    is_recent: boolean;            // true jika update < 90 hari
}

// Option produk (accessories/accessories tambahan)
export interface ProductPriceMktOption {
    nm_product_opt: string;
    amount: string;
    kurs: string;
    estimasi: string;
}

export interface ProductPriceMktState {
    products: ProductPriceMktProduct[];
    selectedDetail: ProductPriceMktDetail | null;
    options: ProductPriceMktOption[];
    isLoading: boolean;
    isDetailLoading: boolean;
    error: string | null;
}
