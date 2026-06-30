import { Cst, CstDetail } from '../types/cst.types';

export const dummyCstList: Cst[] = [
    {
        id_afs_cst: 'CST-001',
        cst_code: 'CST/2026/06/0001',
        cst_date: '2026-06-25',
        csr_code: 'CSR/2026/06/0001',
        nm_customers: 'PT. Sukses Makmur',
        code_product: 'PRD-001',
        nm_product: 'Mesin EDC',
        nm_karyawan: 'Ahmad Teknisi',
        approved_csr_by: 'Budi Manager',
        status: 'OUTSTANDING',
        f_cancel: 0
    },
    {
        id_afs_cst: 'CST-002',
        cst_code: 'CST/2026/06/0002',
        cst_date: '2026-06-26',
        csr_code: 'CSR/2026/06/0002',
        nm_customers: 'Toko Sejahtera',
        code_product: 'PRD-002',
        nm_product: 'Printer Thermal',
        nm_karyawan: 'Siti Teknisi',
        approved_csr_by: 'Budi Manager',
        status: 'ON PROGRESS',
        f_cancel: 0
    },
    {
        id_afs_cst: 'CST-003',
        cst_code: 'CST/2026/06/0003',
        cst_date: '2026-06-27',
        csr_code: 'CSR/2026/06/0003',
        nm_customers: 'Warung Laris',
        code_product: 'PRD-003',
        nm_product: 'Barcode Scanner',
        nm_karyawan: 'Bambang Teknisi',
        approved_csr_by: 'Andi Supervisor',
        status: 'DONE',
        f_cancel: 0
    },
    {
        id_afs_cst: 'CST-004',
        cst_code: 'CST/2026/06/0004',
        cst_date: '2026-06-28',
        csr_code: 'CSR/2026/06/0004',
        nm_customers: 'Minimarket ABC',
        code_product: 'PRD-004',
        nm_product: 'Cash Drawer',
        nm_karyawan: 'Joko Teknisi',
        approved_csr_by: 'Andi Supervisor',
        status: 'CANCEL',
        f_cancel: 1
    }
];

export const dummyCstDetail: Record<string, CstDetail> = {
    'CST/2026/06/0001': {
        ...dummyCstList[0],
        customers_address: 'Jl. Merdeka No. 1, Jakarta',
        csr_date: '2026-06-20',
        lokasi: 'Dalam Kota',
        sts_pasang: '0', // Service
        lap_kerusakan: 'Layar blank dan tidak bisa print',
        image: null,
        barcode: 'SN-987654321',
        nm_product_kategori: 'Hardware',
        do_code: 'DO/2026/06/001',
        waranty_start: '2025-06-25',
        waranty_time: '12',
        waranty_end: '2026-06-25',
        keterangan: 'Perlu penggantian layar',
    },
    'CST/2026/06/0002': {
        ...dummyCstList[1],
        customers_address: 'Jl. Sudirman No. 10, Bandung',
        csr_date: '2026-06-22',
        lokasi: 'Luar Kota',
        sts_pasang: '1', // Pasang Baru
        lap_kerusakan: 'Instalasi mesin baru',
        image: null,
        barcode: 'SN-123456789',
        nm_product_kategori: 'Perangkat',
        do_code: 'DO/2026/06/002',
        waranty_start: '2026-06-26',
        waranty_time: '12',
        waranty_end: '2027-06-26',
        keterangan: 'Instalasi di cabang baru',
    },
    'CST/2026/06/0003': {
        ...dummyCstList[2],
        customers_address: 'Jl. Mawar 5, Surabaya',
        csr_date: '2026-06-24',
        lokasi: 'Dalam Kota',
        sts_pasang: '0',
        lap_kerusakan: 'Scanner tidak terbaca',
        image: null,
        barcode: 'SN-SCN-001',
        nm_product_kategori: 'Aksesoris',
        do_code: 'DO/2026/06/003',
        waranty_start: '2025-10-10',
        waranty_time: '12',
        waranty_end: '2026-10-10',
        keterangan: 'Kabel USB bermasalah',
    }
};
