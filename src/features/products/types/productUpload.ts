export interface ProductUploadItem {
    code_product: string;
    nm_product: string;
    id_product_kategori: string | null;
    id_product_sub_kategori: string | null;
    id_product_brand: string | null;
    product_deskripsi: string | null;
    nm_product_kategori: string | null;
    nm_product_sub_kategori: string | null;
    nm_product_brand: string | null;
    error_message: string | null;
    f_ada: boolean; // true = valid, false = error
}

export interface ProductUploadState {
    previewData: ProductUploadItem[];
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;
    successMessage: string | null;
}
