export interface ProductCategoryData {
    id_product_kategori: string;
    kode_product_kategori: string;
    nm_product_kategori: string;
    f_status?: 't' | 'f';
}

export interface ProductCategoryFormData {
    nm_product_kategori: string;
}
