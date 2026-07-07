export interface ListSOItem {
    id_so: string;
    code_so: string;
    date_so: string;
    id_customers: string;
    nm_customers: string;
    nm_karyawan: string;
    vcurrency: string;
    tot_qty: number;
    tot_price_netto: number;
    harga_ppn: number;
    status_so: string;
}

export interface ListSOProduct {
    id_product: string;
    code_product: string;
    nm_product: string;
    product_deskripsi: string;
    status_barang: string;
    indent_amount: number;
    product_price: number;
    nqty: number;
    nm_product_satuan: string;
    delivery_term: string;
    subtotal: number;
}

export interface ListSODetail {
    id_so: string;
    code_so: string;
    date_so: string;
    status_so: string;
    
    id_karyawan: string;
    nm_karyawan: string;
    id_customers: string;
    nm_customers: string;
    customers_address: string;
    
    date_estimasi: string;
    vcurrency: string;
    nkurs: number;
    flag_ppn: number;
    delivery_term: string;

    nm_type_pembayaran: string;
    nm_cara_pembayaran: string;
    nm_waktu_bayar: string;
    ndp_persen: number;
    ndp_amount: number;
    ntenor: number;
    ntenor_amount: number;

    keterangan: string;
    nm_users: string;

    items: ListSOProduct[];
}

export interface ListSOFilter {
    periode: string; // YYYY-MM or 'ALL'
    id_customers: string;
    id_product: string;
}
