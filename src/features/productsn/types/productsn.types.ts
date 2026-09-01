export interface ProductDataBarang {
    id_product: number | string;
    code_product: string;
    nm_product: string;
}

export interface ProductSn {
    id_product_sn: number | string;
    id_product: number | string;
    sn: string;
    nqty: number;
    product?: ProductDataBarang;
}

export interface ProductSnFormData {
    id_product: number | string;
    sn: string;
    nqty: number;
}
