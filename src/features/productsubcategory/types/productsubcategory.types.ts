export interface ProductSubCategoryData {
    id_product_sub_kategori: string;
    kode_product_sub_kategori: string;
    id_product_kategori: string;
    nm_product_kategori: string;
    nm_product_sub_kategori: string;
}

export interface ProductSubCategoryFormData {
    id_product_kategori: string;
    nm_product_sub_kategori: string;
}

export interface ProductSubCategoryState {
    data: ProductSubCategoryData[];
    isLoading: boolean;
    error: string | null;
    successMessage: string | null;
}
