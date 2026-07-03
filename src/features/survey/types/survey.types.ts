export interface SurveyItem {
    product_code: string;
    product_name: string;
    status_barang: string;
    harga: string;
    qty: string;
    satuan: string;
    delivery_term: string;
}

export interface Survey {
    id_survey: string;
    code_survey: string;
    date_request: string;
    nm_customers: string;
    survey_status: string;
    
    nm_karyawan: string;
    customers_address: string;
    date_estimasi: string;
    vcurrency: string;
    nkurs: string;
    flag_ppn: string;
    delivery_term: string;
    
    date_so: string;
    nm_type_pembayaran: string;
    ndp_persen: string;
    ndp_amount: string;
    ntenor: string;
    ntenor_amount: string;
    nm_cara_pembayaran: string;
    nm_waktu_bayar: string;
    
    keterangan: string;
    
    items: SurveyItem[];
}
