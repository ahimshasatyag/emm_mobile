import { CustomerContact } from '../types/customerContacts.types';

export let DUMMY_CUSTOMER_CONTACTS: CustomerContact[] = [
    {
        id_customers_contact: '1',
        nm_customers_contact: 'Budi Santoso',
        id_customers: '1',
        nm_customers: 'PT Maju Bersama',
        customers_contact_posisi: 'Manager IT',
        customers_contact_phone: '021-1234567',
        customers_contact_mobile: '081234567890',
        customers_contact_email: 'budi@majubersama.com',
        customers_contact_address: 'Jl. Sudirman No. 1, Jakarta'
    },
    {
        id_customers_contact: '2',
        nm_customers_contact: 'Siti Aminah',
        id_customers: '2',
        nm_customers: 'Toko Makmur',
        customers_contact_posisi: 'Admin Penjualan',
        customers_contact_phone: '022-9876543',
        customers_contact_mobile: '085678901234',
        customers_contact_email: 'siti.admin@makmur.co.id',
        customers_contact_address: 'Jl. Ahmad Yani No. 10, Bandung'
    }
];

export const setDummyCustomerContacts = (data: CustomerContact[]) => {
    DUMMY_CUSTOMER_CONTACTS = data;
};
