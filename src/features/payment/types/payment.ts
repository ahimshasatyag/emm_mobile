export type PaymentStatus = 'DRAFT' | 'TERIMA' | 'SETOR' | 'CAIR' | 'TOLAK' | 'BATAL';

export interface Payment {
    id_payment_schdl: string;
    date_update: string;
    vcurrency: string;
    nm_customers: string;
    code_payment_schdl: string;
    date_payment: string;
    v_amount: number;
    status_payment: PaymentStatus;
    no_giro?: string;
    bank_giro_id?: string;
    id_bank?: string;
    code_so?: string;
    payment_ref?: string;
    nkurs?: number;
    f_dp?: string;
    id_invoice?: string;
    id_customers?: string;
}

export interface PaymentFormData {
    id_invoice: string;
    id_customers: string;
    id_payment_method: string;
    date_payment: string;
    v_amount: number;
    payment_ref: string;
    no_giro: string;
    bank_giro_id: string;
    id_bank: string;
    nkurs: number;
    f_dp: string;
}

export interface PaymentMethod {
    id_payment_method: string;
    code_payment_method: string;
    nm_payment_method: string;
}

export interface Bank {
    id_bank: string;
    code_bank: string;
    nm_bank: string;
}
