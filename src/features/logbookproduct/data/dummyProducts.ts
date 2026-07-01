import { LogbookProduct } from '../types/logbookproduct.types';

export const dummyLogbookProducts: LogbookProduct[] = [
    {
        id_log_book: 'LB-202507-001',
        id_product: '1',
        nm_product: 'Mesin Kopi Espresso',
        code_product: 'PRD-001',
        id_type_kerusakan: '1',
        nm_type_kerusakan: 'Mekanik',
        date_log_book: '2025-07-18',
        masalah: 'Air tidak mau keluar dari portafilter',
        solusi: 'Pembersihan saluran air dan penggantian seal',
        catatan: 'Perlu maintenance rutin tiap bulan',
        username: 'Agung',
        date_entry: '2025-07-18 10:00:00'
    },
    {
        id_log_book: 'LB-202507-002',
        id_product: '2',
        nm_product: 'Mesin Grinder',
        code_product: 'PRD-002',
        id_type_kerusakan: '2',
        nm_type_kerusakan: 'Elektrik',
        date_log_book: '2025-07-19',
        masalah: 'Motor grinder tidak berputar',
        solusi: 'Ganti kapasitor motor',
        catatan: 'Cek tegangan listrik outlet',
        username: 'Agung',
        date_entry: '2025-07-19 14:30:00'
    }
];

export const dummyProductsDropdown = [
    { label: 'PRD-001 - Mesin Kopi Espresso', value: '1' },
    { label: 'PRD-002 - Mesin Grinder', value: '2' },
];

export const dummyKerusakanDropdown = [
    { label: 'Mekanik', value: '1' },
    { label: 'Elektrik', value: '2' },
];
