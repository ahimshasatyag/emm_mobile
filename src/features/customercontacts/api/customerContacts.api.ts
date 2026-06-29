import { CustomerContact, CustomerContactFormData } from '../types/customerContacts.types';

// Dummy data for initial development
let DUMMY_CUSTOMER_CONTACTS: CustomerContact[] = [
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

export const customerContactsApi = {
    fetchCustomerContacts: async (): Promise<{ success: boolean; data: CustomerContact[] }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, data: DUMMY_CUSTOMER_CONTACTS });
            }, 800); // Simulate network delay
        });
    },

    fetchCustomerContactById: async (id: string): Promise<{ success: boolean; data: CustomerContact }> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const contact = DUMMY_CUSTOMER_CONTACTS.find(c => c.id_customers_contact === id);
                if (contact) {
                    resolve({ success: true, data: contact });
                } else {
                    reject(new Error('Customer Contact not found'));
                }
            }, 600);
        });
    },

    createCustomerContact: async (data: CustomerContactFormData): Promise<{ success: boolean; message?: string }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newId = (DUMMY_CUSTOMER_CONTACTS.length + 1).toString();
                // We'd typically get nm_customers from backend join, but we'll leave it empty or map it if we had the list here.
                // It's just a dummy anyway.
                DUMMY_CUSTOMER_CONTACTS.push({
                    ...data,
                    id_customers_contact: newId,
                    nm_customers: 'Customer ' + data.id_customers // placeholder
                });
                resolve({ success: true, message: 'Customer Contact created successfully' });
            }, 800);
        });
    },

    updateCustomerContact: async (id: string, data: CustomerContactFormData): Promise<{ success: boolean; message?: string }> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = DUMMY_CUSTOMER_CONTACTS.findIndex(c => c.id_customers_contact === id);
                if (index !== -1) {
                    DUMMY_CUSTOMER_CONTACTS[index] = {
                        ...DUMMY_CUSTOMER_CONTACTS[index],
                        ...data,
                    };
                    resolve({ success: true, message: 'Customer Contact updated successfully' });
                } else {
                    reject(new Error('Customer Contact not found'));
                }
            }, 800);
        });
    },

    deleteCustomerContact: async (id: string): Promise<{ success: boolean; message?: string }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                DUMMY_CUSTOMER_CONTACTS = DUMMY_CUSTOMER_CONTACTS.filter(c => c.id_customers_contact !== id);
                resolve({ success: true, message: 'Customer Contact deleted successfully' });
            }, 600);
        });
    }
};
