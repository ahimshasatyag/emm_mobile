export interface ProductOption {
    id_product_price_opt?: string;
    nm_product_opt: string;
}

export interface ProductData {
    id_product: string;
    code_product: string;
    nm_product: string;
    id_product_kategori: string;
    nm_product_kategori?: string;
    id_product_sub_kategori: string;
    nm_product_sub_kategori?: string;
    id_product_brand: string;
    nm_product_brand?: string;
    id_product_satuan: string;
    nm_product_satuan?: string;
    product_deskripsi: string;
    link_brosur?: string;
    link_foto?: string;
    product_refference?: string;
    flag_active?: '1' | '0';
    kategori?: {
        id_product_kategori: string;
        nm_product_kategori: string;
    };
    brand?: {
        id_product_brand: string;
        nm_product_brand: string;
    };
    subKategori?: {
        id_product_sub_kategori: string;
        nm_product_sub_kategori: string;
    };
    sub_kategori?: {
        id_product_sub_kategori: string;
        nm_product_sub_kategori: string;
    };
    satuan?: {
        id_product_satuan: string;
        nm_product_satuan: string;
    };
    options: ProductOption[];
}

export interface ProductFormData {
    code_product: string;
    nm_product: string;
    id_product_kategori: string;
    id_product_sub_kategori: string;
    id_product_brand: string;
    id_product_satuan: string;
    product_deskripsi: string;
    link_brosur?: string;
    link_foto?: string;
    product_refference?: string;
    options: ProductOption[];
}

export interface CategoryOption {
    id_product_kategori: string;
    nm_product_kategori: string;
}

export interface SubCategoryOption {
    id_product_sub_kategori: string;
    nm_product_sub_kategori: string;
}

export interface BrandOption {
    id_product_brand: string;
    nm_product_brand: string;
}

export interface SatuanOption {
    id_product_satuan: string;
    nm_product_satuan: string;
}
