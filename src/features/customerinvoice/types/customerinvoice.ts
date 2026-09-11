export interface CustomerInvoiceItem {
    id_product: string;
    code_product: string;
    nm_product: string;
    product_deskripsi?: string;
    product_price: number;
    nqty: number;
    nm_product_satuan: string;
    delivery_term?: string;
    ntax?: number;
    nm_product_brand?: string;
}

export interface CustomerInvoicePayment {
    id_invoice_dtl: string;
    id_invoice: string;
    id_payment_method: string | number;
    nm_payment_method: string;
    id_bank?: string | number | null;
    code_retur?: string | null;
    date_draft?: string | null;
    date_terima?: string | null;
    date_setor?: string | null;
    date_cair?: string | null;
    date_tolak?: string | null;
    date_cancel?: string | null;
    f_dp?: string | number;
    f_cancel?: string | number;
    payment_ref?: string;
    v_amount: number;
    nkurs?: number;
    code_giro?: string | null;
    invoice_balance?: number;
    invoice_amount?: number;
    status_payment: string;
    alasan_tolak_cancel?: string | null;
    retur_penjualan_id?: string | number | null;
    id_kb_masuk?: string | number | null;
}

export interface CustomerInvoice {
    id_invoice: string;
    id_customers?: string;
    id_so?: string;
    nm_customers: string;
    date_invoice: string;
    code_invoice: string;
    nm_karyawan: string;
    code_so: string;
    vcurrency: string;
    ntot_balance: number;
    ntot_price_netto_amount: number;
    status_invoice: string;

    // Header detail fields
    customers_address?: string;
    customers_address_invoice?: string;
    customers_phone?: string;
    nkurs?: number;
    ndp_persen?: number;
    ndp_amount?: number;
    date_so?: string;
    nppn_amount?: number;
    no_po_cust?: string;
    flag_ppn?: string | number;
    code_pi?: string;
    date_pi?: string;

    // Relational data from backend
    invoice_dtl?: CustomerInvoicePayment[];
    barang?: CustomerInvoiceItem[];

    // Legacy aliases (for compatibility)
    items?: CustomerInvoiceItem[];
    payments?: CustomerInvoicePayment[];
}

export interface CustomerInvoiceSupportData {
    payment_methods: { id_payment_method: string | number; nm_payment_method: string }[];
    banks: { id_bank: string | number; nm_bank: string }[];
    retur: any[];
    kb_masuk: any[];
}
