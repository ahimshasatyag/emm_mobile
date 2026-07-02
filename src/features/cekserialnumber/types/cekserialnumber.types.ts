export interface CekSerialNumberData {
    code_product: string;
    nm_product: string;
    product_deskripsi: string;
    customer: string;
    customer_address: string;
    provinsi: string;
    kabupaten: string;
    customer_phone: string;
    customer_mobile: string;
    do_code: string;
    waranty_start: string;
    waranty_time: string;
    waranty_end: string;
    waranty_end_raw: string | null;
}

export interface HistoryService {
    cst_code: string;
    cst_date: string;
    catatan_kerusakan: string;
    total_realisasi: string;
    laporan_akhir: string;
    teknisi: string;
}

export interface CekSerialNumberResponse {
    status: boolean;
    data: CekSerialNumberData[];
    history: HistoryService[];
}
