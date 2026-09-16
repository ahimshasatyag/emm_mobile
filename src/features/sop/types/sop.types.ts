export type SopStatus = 'DRAFT' | 'IN PROGRESS' | 'FINALIZE' | 'HISTORY';

export interface SopHistory {
    id_sop_history: string | number;
    divisi?: string | number;
    code_sop?: string;
    nm_sop?: string;
    file_pdf: string | null;
    status?: string;
    date_create?: string;
    username_create?: string;
    date_update?: string;
    username_update?: string;
}

export interface SopItem {
    id_sop: string | number;
    divisi: string | number;
    code_sop: string;
    nm_sop: string;
    file_pdf: string | null;
    status: SopStatus;
    date_create: string;
    username_create?: string;
    date_update?: string;
    username_update?: string;
    nm_karyawan_divisi?: string;
    nm_users?: string;
}

export interface SopDetail {
    header: SopItem;
    history: SopHistory[];
}

export interface DivisionSopSummary {
    id_karyawan_divisi: string | number;
    nm_karyawan_divisi: string;
    total?: number;
}
