export type SopStatus = 'DRAFT' | 'IN PROGRESS' | 'FINALIZE' | 'HISTORY';

export interface SopHistory {
    id: string;
    file_pdf: string | null;
    date_update: string;
}

export interface SopItem {
    id_sop: string;
    divisi: string;
    code_sop: string;
    nm_sop: string;
    file_pdf: string | null;
    status: SopStatus;
    history: SopHistory[];
    date_create: string;
}

export interface DivisionSopSummary {
    divisi: string;
    total: number;
}
