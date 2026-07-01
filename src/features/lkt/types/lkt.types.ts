export interface Lkt {
    id_afs_lkt: string;
    lkt_code: string;
    cst_code: string;
    nm_customers: string;
    actual_starting_date: string; // YYYY-MM-DD
    actual_description: string;
    actual_training: number;
    actual_bongkar: number;
    flag_daring: number; // 0 or 1
    status: 'DRAFT' | 'OUTSTANDING' | 'ON PROGRESS' | 'DONE' | 'CANCEL' | 'CLOSE';
    f_cancel: number;
    age_in: number;
    provinsi: string;
    kabupaten_kota: string;
    type_transport: string;
    garansi: string;
    actual_service_amount: number;
    actual_transport_amount: number;
    actual_day: number;
}

export interface LktDetail extends Lkt {
    nm_karyawan: string; // technician
    actual_accommodation_amount: number;
    actual_tot_detail_amount: number;
    link_foto: string | null;
    estimation_day: number;
}

export interface LktFilter {
    startDate?: string;
    endDate?: string;
    statusFilter: string;
    isAll: boolean;
    searchQuery: string;
}
