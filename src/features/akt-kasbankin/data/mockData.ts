import { KasBankInHeader, KasBankInDetail, Bank, Coa, SalesOrder } from '../types/kasbankin.types';

export const mockBanks: Bank[] = [
    { id_bank: 'B001', nm_bank: 'BCA Cabang Utama' },
    { id_bank: 'B002', nm_bank: 'Mandiri KCP Sudirman' },
    { id_bank: 'B003', nm_bank: 'Kas Besar' },
    { id_bank: 'B004', nm_bank: 'Kas Kecil' },
];

export const mockCoas: Coa[] = [
    { id_coa: 'C100', code_coa: '110-01', coa_name: 'Pendapatan Jasa' },
    { id_coa: 'C101', code_coa: '110-02', coa_name: 'Piutang Usaha' },
    { id_coa: 'C102', code_coa: '210-01', coa_name: 'Hutang Usaha' },
    { id_coa: 'C103', code_coa: '510-01', coa_name: 'Biaya Operasional' },
];

export const mockSalesOrders: SalesOrder[] = [
    { id_so: 'SO001', code_so: 'SO-2023-001', date_so: '2023-01-15', nm_customers: 'PT Maju Jaya', ndp_amount: 5000000 },
    { id_so: 'SO002', code_so: 'SO-2023-002', date_so: '2023-01-20', nm_customers: 'CV Abadi Makmur', ndp_amount: 1500000 },
    { id_so: 'SO003', code_so: 'SO-2023-003', date_so: '2023-02-05', nm_customers: 'Toko Budi', ndp_amount: 3000000 },
];

export const mockKasBankIns: KasBankInHeader[] = [
    {
        id_kb_masuk: 'KB001',
        code_kb_masuk: 'KM-202310-001',
        type_kb: 'k',
        id_bank: 'B003',
        d_bank: '2023-10-15',
        v_amount: 5000000,
        v_balance: 5000000,
        f_dp: false,
        id_so: null,
        deskripsi: 'Penerimaan Kas dari Tunai',
        date_create: '2023-10-15 10:00:00',
        nm_bank: 'Kas Besar',
    },
    {
        id_kb_masuk: 'KB002',
        code_kb_masuk: 'BM-202310-002',
        type_kb: 'b',
        id_bank: 'B001',
        d_bank: '2023-10-16',
        v_amount: 15000000,
        v_balance: 15000000,
        f_dp: true,
        id_so: 'SO001',
        deskripsi: 'Penerimaan DP SO',
        date_create: '2023-10-16 11:30:00',
        nm_bank: 'BCA Cabang Utama',
        code_so: 'SO-2023-001',
        nm_customers: 'PT Maju Jaya',
    }
];

export const mockKasBankInDetails: KasBankInDetail[] = [
    {
        id_kb_masuk_dtl: 'KBD001',
        id_kb_masuk: 'KB001',
        id_coa: 'C100',
        v_amount: 5000000,
        coa_name: 'Pendapatan Jasa',
        deskripsi: 'Penerimaan Jasa Konsultasi',
    },
    {
        id_kb_masuk_dtl: 'KBD002',
        id_kb_masuk: 'KB002',
        id_coa: 'C101',
        v_amount: 15000000,
        coa_name: 'Piutang Usaha',
        deskripsi: 'Pelunasan DP SO',
    }
];
