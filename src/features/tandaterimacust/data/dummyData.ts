import { TandaTerimaCustItem, CustomerData } from '../types/tandaterimacust.types';

export const DUMMY_CUSTOMERS: CustomerData[] = [
    { id_customers: 'C001', nm_customers: 'PT. MAJU MUNDUR' },
    { id_customers: 'C002', nm_customers: 'CV. JAYA SELALU' },
    { id_customers: 'C003', nm_customers: 'TOKO MAKMUR' },
];

export const DUMMY_TANDA_TERIMA: TandaTerimaCustItem[] = [
    {
        id_tanda_terima_cust: '1',
        id_customers: 'C001',
        nm_customers: 'PT. MAJU MUNDUR',
        date_tanda_terima: '2023-10-15',
        keterangan: 'Invoice Pembelian Oktober',
        files: [
            {
                id_tanda_terima_cust_item: '11',
                id_tanda_terima_cust: '1',
                file: 'dummy_invoice_1.pdf',
                nama: 'Invoice Asli'
            }
        ]
    },
    {
        id_tanda_terima_cust: '2',
        id_customers: 'C002',
        nm_customers: 'CV. JAYA SELALU',
        date_tanda_terima: '2023-10-16',
        keterangan: 'Tanda Terima PO',
        files: []
    }
];
