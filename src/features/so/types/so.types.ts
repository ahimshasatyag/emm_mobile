export interface SOItem {
    id_item?: string;
    product_code: string;
    product_name: string;
    status_barang: string;
    harga: string;
    qty: string;
    satuan: string;
    delivery_term: string;
}

export interface SalesOrder {
    id_so: string;
    date_so: string;
    code_so: string;
    status_so: string;
    id_karyawan: string;
    nm_karyawan: string;
    id_customers: string;
    nm_customers: string;
    customers_address?: string;
    customers_email?: string;
    customers_phone?: string;
    no_po_cust: string;

    // Delivery & Logistic
    date_estimasi: string;
    delivery_term: string;
    freight: string;
    freight_amount: string;
    teknisi: string;
    teknisi_amount: string;
    teknisi_customer1_select?: string;
    forklift: string;
    forklift_amount: string;

    // Payment & Finance
    vcurrency: string;
    nkurs: string;
    flag_ppn: string; // "1" atau "0"
    id_type_pembayaran: string;
    nm_type_pembayaran?: string;
    ndp_persen: string;
    ndp_amount: string;
    ntenor: string;
    ntenor_amount: string;
    id_cara_pembayaran: string;
    nm_cara_pembayaran?: string;
    id_waktu_bayar: string;
    nm_waktu_bayar?: string;

    // Additional Info
    keterangan: string;
    code_so_excel: string;
    success_fee: string;
    internal_notes: string;

    items: SOItem[];
}
