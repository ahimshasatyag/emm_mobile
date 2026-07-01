import { LogbookCustomer } from '../types/logbookcustomers.types';

export const dummyCustomersData: LogbookCustomer[] = [
    {
        id_log_book: '1',
        id_customers: 'CUST-001',
        nm_customer: 'PT. Kopi Kenangan',
        date_log_book: '2023-10-25',
        masalah: 'Mesin mati total',
        solusi: 'Ganti power supply',
        catatan: 'Customer minta segera',
        username: 'admin',
    },
    {
        id_log_book: '2',
        id_customers: 'CUST-002',
        nm_customer: 'Kedai Janji Jiwa',
        date_log_book: '2023-10-26',
        masalah: 'Grinder macet',
        solusi: 'Pembersihan burr',
        catatan: 'Routine maintenance',
        username: 'teknisi1',
    },
];

export const dummyCustomersDropdown = [
    { label: 'CUST-001 - PT. Kopi Kenangan', value: 'CUST-001' },
    { label: 'CUST-002 - Kedai Janji Jiwa', value: 'CUST-002' },
    { label: 'CUST-003 - Kopi Kenangan', value: 'CUST-003' },
];
