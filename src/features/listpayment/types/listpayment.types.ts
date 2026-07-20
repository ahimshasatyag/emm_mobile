export interface ListPaymentItem {
    id_so: string;
    code_so: string;
    date_so: string;
    nm_customers: string;
    type_kategori: string;
    vcurrency: string;
    harga_ppn: string; // unit price
    tot_qty: string;
    code_product: string;
    nm_product: string;
    nm_product_brand: string;
    nm_karyawan: string;
    nm_type_pembayaran: string;
    term_pembayaran: string; // generated from ndp_persen, ntenor etc
    keterangan: string;
    detail_payment: string; // array string with \n or <br> mapped to array? we'll just use string or string[]
    date_invoice: string;
    code_invoice: string;
    date_delivery: string;
    success_fee: number;
    freight_notes: string;
    teknisi_notes: string;
    forklift_notes: string;
    tax_amount: string;
    subtotal: string;
}

export interface ListPaymentSummaryItem {
    kategori: 'month' | 'ytd';
    type_kategori: 'PP' | 'PL' | 'AX';
    product_price: number;
    nqty: number;
}

export interface ListPaymentResponse {
    status: boolean;
    data: ListPaymentItem[];
    data_lap: ListPaymentSummaryItem[];
}

export interface ListPaymentFilter {
    periode: string; // YYYY-MM
    ck_periode: boolean;
    id_customers: string;
    id_product: string;
}
