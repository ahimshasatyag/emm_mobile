export interface RequestStats {
    total_request: number;
    total_pending: number;
    total_progres: number;
}

export interface RequestCsrItem {
    id_afs_csr: number;
    csr_code: string;
    csr_date: string;
    nm_customers: string;
    note: string;
    nm_karyawan?: string;
    code_product?: string;
    csr_by?: string;
    csr_status?: string;
    f_cancel?: number;
    csr_cancel_date?: string;
    csr_approve_date?: string;
}

export interface PendingCstItem {
    id_afs_cst: number;
    cst_code: string;
    cst_date: string;
    nm_customers: string;
    code_product: string;
    status: string;
    tgl_update_status: string;
}

export interface OngoingCstItem {
    id_afs_cst: number;
    cst_code: string;
    cst_date: string;
    nm_customers: string;
    code_product: string;
    status: string;
    max_actual_starting_date: string;
    starting_date: string;
    flag_done: string;
    lkt_f_cancel: number;
    lkt_cancel_date: string;
    lkt_done_date: string;
}

export interface TeknisiData {
    nm_karyawan: string;
    tgl: string;
}

export interface JadwalLkt {
    nm_karyawan: string;
    [key: string]: any;
}

export interface AgingAr {
    nm_customers: string;
    vcurrency: string;
    hiji: number;
    dua: number;
    tilu: number;
    opat: number;
}

export interface QuotationStats {
    quotations: number;
    total_quotations: number;
    total_so: number;
    total_cancelled: number;
    success_rate: number | string;
}

export interface TopProduct {
    id_product: string;
    nm_product: string;
    [key: string]: any;
}

export interface HomeData {
    requestStats: RequestStats;
    teknisiPP: TeknisiData[];
    teknisiPL: TeknisiData[];
    jadwalLkt: JadwalLkt[];
    agingAr: AgingAr[];
    quotationStats: QuotationStats;
    topProductsQuotation: TopProduct[];
    topPriceCheck: TopProduct[];
}
