export interface ProductUnit {
    id_product_satuan: string;
    nm_product_satuan: string;
    date_create?: string;
    date_update?: string | null;
}

export interface ProductUnitFormData {
    nm_product_satuan: string;
}

export interface ProductUnitResponse {
    success: boolean;
    data?: ProductUnit;
    message?: string;
}

export interface ProductUnitListResponse {
    success: boolean;
    data?: ProductUnit[];
    message?: string;
}
