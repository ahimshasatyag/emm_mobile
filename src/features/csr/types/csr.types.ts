export interface CsrProduct {
    id_product: string;
    code_product: string;
    nm_product: string;
}

export interface CsrCustomer {
    id_customers: string;
    nm_customers: string;
}

export interface CsrEmployee {
    id_karyawan: string;
    nm_karyawan: string;
}

export interface Csr {
    id: string; // Internal id for mapping if needed
    csr_code: string;
    csr_date: string;
    id_customers: string;
    nm_customers: string;
    id_karyawan: string;
    nm_karyawan: string;
    id_product: string;
    code_product: string;
    nm_product: string;
    sn_number: string;
    sts_pasang: string;
    do_code: string;
    mesin_lama: string;
    lokasi: string;
    lap_kerusakan: string;
    status: string; // DRAFT, OUTSTANDING, CANCEL
    csr_by?: string;
    image?: string | null;
}

export interface CsrPayload {
    customers: string;
    date_request: string;
    id_product: string;
    sn_number: string;
    sts_pasang: string;
    do_code: string;
    mesin_lama: string;
    id_karyawan: string; // requestor
    lokasi: string;
    lap_kerusakan: string;
    link_foto?: string | null; // For base64 or URI if implemented
}
