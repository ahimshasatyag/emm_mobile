export interface KasBankInHeader {
    id_kb_masuk: string;
    code_kb_masuk: string;
    type_kb: 'k' | 'b'; // k = Kas, b = Bank
    id_bank: string;
    d_bank: string;
    v_amount: number;
    v_balance: number;
    f_dp: boolean;
    id_so: string | null;
    deskripsi: string;
    date_create: string;
    // Relations for display
    nm_bank?: string;
    code_so?: string;
    nm_customers?: string;
}

export interface KasBankInDetail {
    id_kb_masuk_dtl: string;
    id_kb_masuk: string;
    id_coa: string;
    v_amount: number;
    coa_name: string;
    deskripsi: string;
}

export interface Bank {
    id_bank: string;
    nm_bank: string;
}

export interface Coa {
    id_coa: string;
    code_coa: string;
    coa_name: string;
}

export interface SalesOrder {
    id_so: string;
    code_so: string;
    date_so: string;
    nm_customers: string;
    ndp_amount: number;
}
