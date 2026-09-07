export interface Lkt {
    id_afs_lkt: number;
    id_afs_cst: number;
    lkt_code: string;
    cst_code: string;
    csr_code: string;
    nm_customers: string;
    nm_karyawan: string;
    nm_product: string;
    starting_date: string;
    estimation_day: number;
    description: string;
    service_amount: number;
    transport_amount: number;
    accommodation_amount: number;
    tot_detail_amount: number;
    actual_transport: string; // type_transport
    image: string | null;
    bast: string | null;
    flag_done: string; // Draft | ON PROGRESS | DONE | CLOSE | CANCEL
    lkt_done_date: string | null;
    lkt_cancel_date: string | null;
    f_cancel: number;
    // from joins
    status?: string;
    actual_starting_date?: string;
    actual_description?: string;
    actual_training?: number;
    actual_bongkar?: number;
    flag_daring?: number;
    actual_service_amount?: number;
    actual_transport_amount?: number;
    actual_day?: number;
    actual_accommodation_amount?: number;
    actual_tot_detail_amount?: number;
    age_in?: number;
    provinsi?: string;
    kabupaten_kota?: string;
    type_transport?: string;
    garansi?: string;
}

export interface RealisasiTeknisi {
    id_karyawan: number;
    nm_karyawan: string;
    actual_id_karyawan: number;
}

export interface RealisasiPart {
    nama_part: string;
    qty: number;
    harga: number;
}

export interface Realisasi {
    lkt_sub_code: number;
    id_afs_lkt: number;
    actual_starting_date: string;
    actual_day: number;
    actual_description: string;
    actual_service_amount: number;
    actual_transport_amount: number;
    actual_accommodation_amount: number;
    actual_training: number;
    actual_bongkar: number;
    actual_tot_detail_amount: number;
    flag_daring: number;
    image: string | null;
    status: string; // Draft | ON PROGRESS | CLOSE | CANCEL
    f_cancel: number;
    lap_penyelesain?: string;
    alasan_cancel?: string;
    teknisi_list?: RealisasiTeknisi[];
    parts?: RealisasiPart[];
}

export interface LktDetail extends Lkt {
    cst_date?: string;
    csr_date?: string;
    lap_kerusakan?: string;
    barcode?: string;
    lokasi?: string;
    customers_address?: string;
    code_product?: string;
    link_foto?: string | null;
    realisasi_list?: Realisasi[];
    parts?: RealisasiPart[];
    // compat fields
    actual_accommodation_amount?: number;
    actual_tot_detail_amount?: number;
}

export interface LktFilter {
    startDate?: string;
    endDate?: string;
    statusFilter: string;
    isAll: boolean;
    searchQuery: string;
}

export interface LktFormPayload {
    cst_code: string;
    starting_date: string;
    estimation_day: number;
    description: string;
    service_amount: number;
    transport_amount: number;
    accommodation_amount: number;
    type_transport?: string;
    image?: string;
    added_by?: string;
}

export interface RealisasiFormPayload {
    actual_starting_date: string;
    actual_day: number;
    actual_description: string;
    actual_service_amount: number;
    actual_transport_amount: number;
    actual_accommodation_amount: number;
    actual_training: number;
    actual_bongkar: number;
    flag_daring: boolean;
    teknisi_ids: number[];
    image?: string;
    added_by?: string;
    updated_by?: string;
}

export interface TeknisiOption {
    id_karyawan: number;
    nm_karyawan: string;
}
