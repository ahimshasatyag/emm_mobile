export interface QuotationItem {
    id_item: string;
    id_product: string;
    product_code: string;
    product_name: string;
    status_barang: 'READY' | 'INDENT';
    indent_amount?: number;
    harga: number;
    qty: number;
    satuan: string;
    delivery_term: string;
    line_total: number;
}

export interface Quotation {
    id_quotation: string;
    quotation_number: string;
    date_so: string;
    customer_id: string;
    customer_name: string;
    sales_person_id: string;
    sales_person_name: string;
    price_list?: string;
    total: number;
    status: string; // 'Draft', 'Approved', etc.
    
    // Add form specific fields
    delivery_to?: string;
    informasi_pembeli?: string;
    estimasi_pengiriman?: string;
    mata_uang?: 'IDR' | 'USD';
    kurs?: number;
    flag_ppn?: string;
    delivery_term_header?: string;
    
    // Biaya
    freight_type?: string;
    freight_charge?: number;
    teknisi_type?: string;
    teknisi_charge?: number;
    forklift_type?: string;
    forklift_charge?: number;
    
    // Payment
    metode_payment?: string;
    dp_persen?: number;
    dp_amount?: number;
    tenor?: number;
    tenor_amount?: number;
    tipe_pembayaran?: string;
    waktu_bayar?: string;
    
    // Others
    keterangan?: string;
    code_so_excel?: string;
    no_po_cust?: string;
    success_fee?: number;
    internal_notes?: string;

    items: QuotationItem[];
}
