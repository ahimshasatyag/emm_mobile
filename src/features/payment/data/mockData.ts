import { Payment, PaymentMethod, Bank } from '../types/payment';

export const mockPayments: Payment[] = [
    {
        id_payment_schdl: '1',
        date_update: '2026-07-15 10:00:00',
        vcurrency: 'IDR',
        nm_customers: 'PT Maju Bersama',
        code_payment_schdl: 'PAY-202607-0001',
        date_payment: '2026-07-15',
        v_amount: 15000000,
        status_payment: 'DRAFT',
        code_so: 'SO-202607-001',
    },
    {
        id_payment_schdl: '2',
        date_update: '2026-07-14 14:30:00',
        vcurrency: 'IDR',
        nm_customers: 'CV Abadi Makmur',
        code_payment_schdl: 'PAY-202607-0002',
        date_payment: '2026-07-14',
        v_amount: 5000000,
        status_payment: 'CAIR',
        code_so: 'SO-202607-002',
    }
];

export const mockPaymentMethods: PaymentMethod[] = [
    { id_payment_method: '1', code_payment_method: 'CASH', nm_payment_method: 'Tunai' },
    { id_payment_method: '2', code_payment_method: 'TRF', nm_payment_method: 'Transfer Bank' },
    { id_payment_method: '3', code_payment_method: 'GIRO', nm_payment_method: 'Giro' },
];

export const mockBanks: Bank[] = [
    { id_bank: '1', code_bank: 'BCA', nm_bank: 'Bank Central Asia' },
    { id_bank: '2', code_bank: 'MANDIRI', nm_bank: 'Bank Mandiri' },
    { id_bank: '3', code_bank: 'BNI', nm_bank: 'Bank Negara Indonesia' },
];
