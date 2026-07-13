import { QuotationApproval, AccountingApproval, HistoryApproval } from '../types/approve.types';

export const mockQuotations: QuotationApproval[] = [
    {
        id_approval: 'APP-Q-001',
        date_request: '2024-05-15',
        code_so: 'SO-2024-0001',
        nm_karyawan: 'Budi Santoso',
        nm_customers: 'PT Maju Jaya',
        nm_type_pembayaran: 'Kredit',
        ndp_persen: 30,
        ndp_amount: 3000000,
        ntenor: 12,
        ntenor_amount: 583333,
        nm_waktu_bayar: '30 Hari',
        internal_notes: 'Pelanggan lama, minta prioritas.',
        products: [
            {
                id_product: 'P-001',
                code_product: 'PRD-ABC',
                product_price: 10000000,
                product_price_old: 11000000,
                ndiskon_persen: 9.09,
            }
        ],
        action_approve: '1',
        action_canceled: '0',
    },
    {
        id_approval: 'APP-Q-002',
        date_request: '2024-05-16',
        code_so: 'SO-2024-0002',
        nm_karyawan: 'Siti Aminah',
        nm_customers: 'CV Abadi Makmur',
        nm_type_pembayaran: 'Cash',
        ndp_persen: 100,
        ndp_amount: 5000000,
        ntenor: 0,
        ntenor_amount: 0,
        nm_waktu_bayar: 'Cash on Delivery',
        internal_notes: '',
        products: [
            {
                id_product: 'P-002',
                code_product: 'PRD-XYZ',
                product_price: 5000000,
                product_price_old: 5000000,
                ndiskon_persen: 0,
            }
        ],
        action_approve: '1',
        action_canceled: '0',
    }
];

export const mockAccounting: AccountingApproval[] = [
    {
        id_approval: 'APP-A-001',
        date_request: '2024-05-17',
        nm_users: 'Andi',
        nm_module: 'Payment',
        code_key_table: 'PAY-001',
        alasan: 'Pembayaran Telat',
        action_approve: '1',
        action_canceled: '0',
    }
];

export const mockHistory: HistoryApproval[] = [
    {
        id_approval: 'APP-Q-000',
        date_request: '2024-05-10',
        nm_users: 'Budi Santoso',
        nm_module: 'Quotation',
        code_key_table: 'SO-2024-0000',
        alasan: 'Diskon Terlalu Besar',
        action_dipilih: 0, 
    },
    {
        id_approval: 'APP-A-000',
        date_request: '2024-05-11',
        nm_users: 'Andi',
        nm_module: 'Payment',
        code_key_table: 'PAY-000',
        alasan: '-',
        action_dipilih: 1, 
    },
    {
        id_approval: 'APP-PI-001',
        date_request: '2026-07-13',
        nm_users: 'Siti Aminah',
        nm_module: 'Proforma Invoice',
        code_key_table: 'PI-2026-0123',
        alasan: 'Butuh segera',
        action_dipilih: 1, 
    }
];
