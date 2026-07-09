export interface QuotationAPOption {
    id_po_opt_dtl?: string;
    id_po_dtl?: string;
    id_product: string;
    id_po?: string;
    nm_product_opt: string;
    harga: number;
}

export interface QuotationAPDetail {
    id_po_dtl: string;
    id_po: string;
    id_product: string;
    code_product: string;
    nm_product: string;
    product_deskripsi: string;
    qty: number;
    product_price: number;
    notes: string;
    options?: QuotationAPOption[];
}

export interface QuotationAP {
    id_po: string;
    code_po: string;
    date_po: string;
    status_po: 'QUOTATION' | 'DRAFT' | 'CANCEL';
    date_schdl: string | null;
    id_suppliers: string;
    nm_suppliers: string;
    id_gudang: string;
    id_mata_uang: string;
    partner_ref: string;
    notes: string;
    amount_total: number;
    id_product_lokasi: string;
    date_create: string;
    details?: QuotationAPDetail[];
}
