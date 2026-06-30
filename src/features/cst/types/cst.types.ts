export interface Cst {
    id_afs_cst: string;
    cst_code: string;
    cst_date: string; // YYYY-MM-DD
    csr_code: string;
    nm_customers: string;
    code_product: string;
    nm_product: string;
    nm_karyawan: string; // Requestor
    approved_csr_by: string; // User
    status: 'DRAFT' | 'OUTSTANDING' | 'ON PROGRESS' | 'DONE' | 'CANCEL' | 'PENDING';
    f_cancel: number;
}

export interface CstDetail extends Cst {
    customers_address: string;
    csr_date: string;
    lokasi: string;
    sts_pasang: string; // '0' or '1'
    lap_kerusakan: string;
    image: string | null;
    barcode: string; // serial number
    nm_product_kategori: string;
    do_code: string;
    waranty_start: string;
    waranty_time: string; // e.g. "12"
    waranty_end: string;
    keterangan: string;
    lkt_list?: any[];
}

export interface CstFilter {
    startDate?: string;
    endDate?: string;
    statusFilter: string;
    isAll: boolean;
    searchQuery: string;
}
