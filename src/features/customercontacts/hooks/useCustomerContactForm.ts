import { useState, useCallback } from 'react';
import { CustomerContactFormData } from '../types/customerContacts.types';
import { customerContactsApi } from '../api/customerContacts.api';
import { customersApi } from '../../customers/api/customers.api';
import { Customer } from '../../customers/types/customers.types';

const initialFormData: CustomerContactFormData = {
    nm_customers_contact: '',
    id_customers: '',
    customers_contact_posisi: '',
    customers_contact_phone: '',
    customers_contact_mobile: '',
    customers_contact_email: '',
    customers_contact_address: '',
};

export function useCustomerContactForm() {
    const [formData, setFormData] = useState<CustomerContactFormData>(initialFormData);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [customers, setCustomers] = useState<Customer[]>([]);

    const updateField = useCallback(<K extends keyof CustomerContactFormData>(
        field: K,
        value: CustomerContactFormData[K]
    ) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError(null);
    }, []);

    const loadInitialData = async (id?: string) => {
        try {
            setIsLoading(true);
            setError(null);

            // Fetch customers for dropdown
            const customersRes = await customersApi.fetchCustomers();
            setCustomers(customersRes.data);

            if (id) {
                const res = await customerContactsApi.fetchCustomerContactById(id);
                setFormData({
                    id_customers_contact: res.data.id_customers_contact,
                    nm_customers_contact: res.data.nm_customers_contact || '',
                    id_customers: res.data.id_customers || '',
                    customers_contact_posisi: res.data.customers_contact_posisi || '',
                    customers_contact_phone: res.data.customers_contact_phone || '',
                    customers_contact_mobile: res.data.customers_contact_mobile || '',
                    customers_contact_email: res.data.customers_contact_email || '',
                    customers_contact_address: res.data.customers_contact_address || '',
                });
            } else {
                setFormData(initialFormData);
            }
        } catch (err: any) {
            setError(err.message || 'Gagal memuat data');
        } finally {
            setIsLoading(false);
        }
    };

    const validateForm = () => {
        if (!formData.nm_customers_contact.trim()) return 'Nama Kontak Pelanggan harus diisi';
        if (!formData.id_customers) return 'Company Name harus dipilih';
        return null;
    };

    const save = async (): Promise<string | null> => {
        const errorMsg = validateForm();
        if (errorMsg) {
            setError(errorMsg);
            return null;
        }

        try {
            setIsSaving(true);
            setError(null);

            if (formData.id_customers_contact) {
                await customerContactsApi.updateCustomerContact(formData.id_customers_contact, formData);
                return formData.id_customers_contact;
            } else {
                const res = await customerContactsApi.createCustomerContact(formData);
                return res.data?.id_customers_contact || null;
            }
        } catch (err: any) {
            setError(err.message || 'Gagal menyimpan data');
            return null;
        } finally {
            setIsSaving(false);
        }
    };

    return {
        formData,
        customers,
        isLoading,
        isSaving,
        error,
        updateField,
        loadInitialData,
        validateForm,
        save,
    };
}
