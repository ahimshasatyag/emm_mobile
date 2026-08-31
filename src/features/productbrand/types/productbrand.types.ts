export interface ProductBrand {
    id_product_brand: string;
    nm_product_brand: string;
}

export interface ProductBrandFormData {
    id_product_brand?: string;
    nm_product_brand: string;
}

export interface ProductBrandResponse {
    status: string;
    message?: string;
    data: ProductBrand;
}

export interface ProductBrandListResponse {
    status: string;
    message?: string;
    data: ProductBrand[];
}
