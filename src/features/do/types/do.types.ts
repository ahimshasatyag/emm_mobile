export interface DoItem {
    id_do: string;
    code_do: string;
    date_do: string;
    nm_customers: string;
    code_so: string;
    status_do: string;
}

export interface DoProduct {
    id_do_dtl: string;
    id_product: string;
    code_product: string;
    nm_product: string;
    nqty: string;
    nm_product_satuan: string;
    nbarcode: string | null;
    leasing_tahun: string | null;
    leasing_plat: string | null;
}

export interface DoDetail {
    id_do: string;
    code_do: string;
    date_do: string;
    id_customers: string;
    nm_customers: string;
    customers_address: string;
    code_so: string;
    keterangan_so: string | null;
    freight: string;
    freight_amount: string;
    forklift: string;
    forklift_amount: string;
    date_estimasi: string;
    date_delivery: string | null;
    keterangan: string | null;
    status_do: string;
    flag_payment: string;
    items: DoProduct[];
}

export interface DoState {
    list: DoItem[];
    detail: DoDetail | null;
    loading: boolean;
    loadingDetail: boolean;
    error: string | null;
}
