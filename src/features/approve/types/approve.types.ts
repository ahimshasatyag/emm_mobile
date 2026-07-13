export interface ProductItem {
    id_product: string;
    code_product: string;
    product_price: number;
    product_price_old: number;
    ndiskon_persen: number;
}

export interface QuotationApproval {
    id_approval: string;
    date_request: string;
    code_so: string;
    nm_karyawan: string;
    nm_customers: string;
    nm_type_pembayaran: string;
    ndp_persen: number;
    ndp_amount: number;
    ntenor: number;
    ntenor_amount: number;
    nm_waktu_bayar: string;
    internal_notes: string;
    products: ProductItem[];
    action_approve: string;
    action_canceled: string;
}

export interface AccountingApproval {
    id_approval: string;
    date_request: string;
    nm_users: string;
    nm_module: string;
    code_key_table: string;
    alasan: string;
    action_approve: string;
    action_canceled: string;
}

export interface HistoryApproval {
    id_approval: string;
    date_request: string;
    nm_users: string;
    nm_module: string;
    code_key_table: string;
    alasan: string;
    action_dipilih: number; // 1 = Approved, 0 = Rejected
}
