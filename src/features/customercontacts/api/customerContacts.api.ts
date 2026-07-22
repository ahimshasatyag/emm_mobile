import { CustomerContact, CustomerContactFormData } from '../types/customerContacts.types';
import { DUMMY_CUSTOMER_CONTACTS, setDummyCustomerContacts } from '../data/customerContacts.data';

export const customerContactsApi = {
    fetchCustomerContacts: async (): Promise<{ success: boolean; data: CustomerContact[] }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, data: [...DUMMY_CUSTOMER_CONTACTS] });
            }, 800); // Simulate network delay
        });
    },

    fetchCustomerContactById: async (id: string): Promise<{ success: boolean; data: CustomerContact }> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const contact = DUMMY_CUSTOMER_CONTACTS.find(c => c.id_customers_contact === id);
                if (contact) {
                    resolve({ success: true, data: { ...contact } });
                } else {
                    reject(new Error('Customer Contact not found'));
                }
            }, 600);
        });
    },

    createCustomerContact: async (data: CustomerContactFormData): Promise<{ success: boolean; message?: string; data?: any }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newId = (DUMMY_CUSTOMER_CONTACTS.length + 1).toString();
                setDummyCustomerContacts([
                    ...DUMMY_CUSTOMER_CONTACTS,
                    {
                        ...data,
                        id_customers_contact: newId,
                        nm_customers: 'Customer ' + data.id_customers // placeholder
                    }
                ]);
                resolve({ success: true, message: 'Customer Contact created successfully', data: { id_customers_contact: newId } });
            }, 800);
        });
    },

    updateCustomerContact: async (id: string, data: CustomerContactFormData): Promise<{ success: boolean; message?: string }> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = DUMMY_CUSTOMER_CONTACTS.findIndex(c => c.id_customers_contact === id);
                if (index !== -1) {
                    const newArray = [...DUMMY_CUSTOMER_CONTACTS];
                    newArray[index] = {
                        ...newArray[index],
                        ...data,
                    };
                    setDummyCustomerContacts(newArray);
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
                setDummyCustomerContacts(DUMMY_CUSTOMER_CONTACTS.filter(c => c.id_customers_contact !== id));
                resolve({ success: true, message: 'Customer Contact deleted successfully' });
            }, 600);
        });
    }
};
