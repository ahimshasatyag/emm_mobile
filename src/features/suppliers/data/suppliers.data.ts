import { Supplier } from '../types/suppliers.types';

export const DUMMY_SUPPLIERS: Supplier[] = [
    {
        id_suppliers: 'SUP-001',
        nm_suppliers: 'PT. Maju Bersama',
        suppliers_mobile: '081234567890',
        suppliers_email: 'info@majubersama.com',
        suppliers_address: 'Jl. Sudirman No. 123, Jakarta Pusat',
        suppliers_phone: '021-1234567',
        suppliers_fax: '021-1234568',
        suppliers_website: 'www.majubersama.com',
        mata_uang: 'IDR',
        suppliers_logo: null,
        qty_purchase: 1250,
        contacts: [
            {
                nm_suppliers_contact: 'Budi Santoso',
                suppliers_contact_posisi: 'Sales Manager',
                suppliers_contact_phone: '08111222333',
                suppliers_contact_email: 'budi@majubersama.com',
            }
        ]
    },
    {
        id_suppliers: 'SUP-002',
        nm_suppliers: 'CV. Karya Indah',
        suppliers_mobile: '081987654321',
        suppliers_email: 'contact@karyaindah.net',
        suppliers_address: 'Jl. Ahmad Yani No. 45, Bandung',
        suppliers_phone: '022-9876543',
        suppliers_fax: '022-9876544',
        suppliers_website: 'www.karyaindah.net',
        mata_uang: 'IDR',
        suppliers_logo: null,
        qty_purchase: 850,
        contacts: [
            {
                nm_suppliers_contact: 'Siti Aminah',
                suppliers_contact_posisi: 'Marketing',
                suppliers_contact_phone: '08199887766',
                suppliers_contact_email: 'siti@karyaindah.net',
            },
            {
                nm_suppliers_contact: 'Rudi Hermawan',
                suppliers_contact_posisi: 'Direktur',
                suppliers_contact_phone: '08122334455',
                suppliers_contact_email: 'rudi@karyaindah.net',
            }
        ]
    },
    {
        id_suppliers: 'SUP-003',
        nm_suppliers: 'Global Tech Solutions',
        suppliers_mobile: '085544332211',
        suppliers_email: 'sales@globaltech.com',
        suppliers_address: 'Sudirman Central Business District, Jakarta Selatan',
        suppliers_phone: '021-5556667',
        suppliers_fax: '',
        suppliers_website: 'www.globaltech.com',
        mata_uang: 'USD',
        suppliers_logo: null,
        qty_purchase: 430,
        contacts: [
            {
                nm_suppliers_contact: 'John Doe',
                suppliers_contact_posisi: 'Account Manager',
                suppliers_contact_phone: '085544332211',
                suppliers_contact_email: 'john@globaltech.com',
            }
        ]
    }
];
