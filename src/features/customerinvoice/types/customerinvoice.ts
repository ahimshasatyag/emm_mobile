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
    id_payment_method: string;
    nm_payment_method: string;
    code_retur?: string | null;
    date_draft: string;
    f_dp: string | number;
    payment_ref: string;
    v_amount: number;
    status_payment: string;
}

export interface CustomerInvoice {
    id_invoice: string;
    nm_customers: string;
    date_invoice: string;
    code_invoice: string;
    nm_karyawan: string;
    code_so: string;
    vcurrency: string;
    ntot_balance: number;
    ntot_price_netto_amount: number;
    status_invoice: string;
    
    // Header specific
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

    // Relational data
    items?: CustomerInvoiceItem[];
    payments?: CustomerInvoicePayment[];
}
