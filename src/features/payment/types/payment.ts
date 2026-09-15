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
    code_so?: string;
    no_giro?: string;
    bank_giro_id?: string;
    id_bank?: string;
    payment_ref?: string;
    nkurs?: number;
    f_dp?: string;
    id_invoice?: string;
    id_customers?: string;
    code_invoice?: string;
    id_payment_method?: string;
}

export interface PaymentFormData {
    id_invoice: string;
    id_customers: string;
    id_bank?: string;
    payments: {
        id_payment_method: string;
        date_payment: string;
        v_amount: number | string;
        payment_ref?: string;
        no_giro?: string;
        bank_giro_id?: string;
        nkurs?: number | string;
        dp?: boolean | string;
    }[];
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

export interface BankGiro {
    id_bank_giro: string;
    code_bank_giro: string;
    nm_bank_giro: string;
}

export interface InvoiceCustomer {
    id_customers: string;
    nm_customers: string;
}

export interface InvoiceDetail {
    code_invoice: string;
    id_customers: string;
    nm_customers: string;
    ntenor: string;
    ndp_amount: string;
    ntenor_amount: string;
    ntot_price_netto_amount: string;
    ntot_balance: string;
    vcurrency: string;
    nkurs: string;
}

export interface PaymentSupportData {
    data_invoice: any[];
    data_customers_invoice: InvoiceCustomer[];
    data_payment_method: PaymentMethod[];
    data_bank: Bank[];
    data_bank_giro: BankGiro[];
}
