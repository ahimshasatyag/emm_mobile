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
    detail_payment: string | null; 
    date_invoice: string;
    code_invoice: string;
    date_delivery: string;
    success_fee: number;
    freight: string | number;
    freight_amount: number;
    teknisi: string | number;
    teknisi_amount: number;
    forklift: string | number;
    forklift_amount: number;
    ndp_persen: number;
    ndp_amount: number;
    ntenor: number;
    ntenor_amount: number;
    flag_ppn: string | number;
}

export interface ListPaymentDetailItem {
    id_product: string;
    code_product: string;
    nm_product: string;
    product_price: string;
    nqty: string;
    satuan?: string;
    date_delivery?: string;
}

export interface ListPaymentDetail extends Omit<ListPaymentItem, 'code_product' | 'nm_product' | 'harga_ppn' | 'tot_qty'> {
    items: ListPaymentDetailItem[];
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
