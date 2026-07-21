export interface TandaTerimaCustFile {
    id_tanda_terima_cust_item: string;
    id_tanda_terima_cust: string;
    file: string;
    nama: string;
    keterangan?: string;
}

export interface TandaTerimaCustItem {
    id_tanda_terima_cust: string;
    id_customers: string;
    nm_customers: string;
    date_tanda_terima: string;
    keterangan: string;
    files: TandaTerimaCustFile[];
}

export interface CustomerData {
    id_customers: string;
    nm_customers: string;
}
