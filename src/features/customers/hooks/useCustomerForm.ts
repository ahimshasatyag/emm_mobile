import { useState, useCallback } from 'react';
import { CustomerFormData, CustomerContact, Province, Regency } from '../types/customers.types';
import { customersApi } from '../api/customers.api';
import { Alert } from 'react-native';

const initialFormData: CustomerFormData = {
    nm_customers: '',
    customers_address: '',
    customers_address_invoice: '',
    customers_phone: '',
    customers_mobile: '',
    customers_email: '',
    customers_fax: '',
    f_company: false,
    nama_lengkap: '',
    nik: '',
    nib: '',
    npwp: '',
    alamat: '',
    provinsi: '',
    kabupaten: '',
    is_blacklist: false,
    is_external_sales: false,
    contacts: [],
};

export function useCustomerForm(initialId?: string) {
    const [formData, setFormData] = useState<CustomerFormData>(initialFormData);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [initialLoadDone, setInitialLoadDone] = useState(false);
    
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [regencies, setRegencies] = useState<Regency[]>([]);

    const loadInitialData = useCallback(async () => {
        try {
            setInitialLoadDone(false);
            
            // Load provinces
            const provRes = await customersApi.fetchProvinces();
            if (provRes.success) {
                setProvinces(provRes.data);
            }

            if (initialId) {
                const res = await customersApi.fetchCustomerById(initialId);
                if (res.success && res.data) {
                    const header = res.data.header;
                    
                    // Match province ID by name or just use it (assuming backend returns name, we might need ID. Let's assume we find it)
                    let matchedProvId = '';
                    if (provRes.success) {
                        const matched = provRes.data.find(p => p.nama === header.provinsi || p.id === header.provinsi);
                        if (matched) matchedProvId = matched.id;
                    }

                    // Load regencies for that province if found
                    if (matchedProvId) {
                        const kabRes = await customersApi.fetchKabupaten(matchedProvId);
                        if (kabRes.success) setRegencies(kabRes.data);
                    }

                    setFormData({
                        id_customers: header.id_customers,
                        nm_customers: header.nm_customers || '',
                        customers_address: header.customers_address || '',
                        customers_address_invoice: header.customers_address_invoice || '',
                        customers_phone: header.customers_phone || '',
                        customers_mobile: header.customers_mobile || '',
                        customers_email: header.customers_email || '',
                        customers_fax: header.customers_fax || '',
                        f_company: header.f_company || false,
                        nama_lengkap: header.nama_lengkap || '',
                        nik: header.nik || '',
                        nib: header.nib || '',
                        npwp: header.npwp || '',
                        alamat: header.alamat || '',
                        provinsi: matchedProvId || header.provinsi,
                        kabupaten: header.kabupaten || '', // we'll rely on dropdown finding the right ID or name
                        is_blacklist: header.is_blacklist || false,
                        is_external_sales: header.is_external_sales || false,
                        contacts: res.data.items || [],
                    });
                }
            }
        } catch (e: any) {
            setError(e.message || 'Gagal memuat data pelanggan');
        } finally {
            setInitialLoadDone(true);
        }
    }, [initialId]);

    const handleProvinceChange = async (provId: string) => {
        updateField('provinsi', provId);
        updateField('kabupaten', ''); // Reset regency
        const kabRes = await customersApi.fetchKabupaten(provId);
        if (kabRes.success) {
            setRegencies(kabRes.data);
        }
    };

    const updateField = useCallback((field: keyof CustomerFormData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    }, []);

    const addContact = useCallback(() => {
        setFormData(prev => ({
            ...prev,
            contacts: [
                ...prev.contacts,
                {
                    id_contact: Date.now().toString(),
                    nm_customers_contact: '',
                    customers_contact_posisi: '',
                    customers_contact_phone: '',
                    customers_contact_email: '',
                }
            ]
        }));
    }, []);

    const removeContact = useCallback((index: number) => {
        setFormData(prev => ({
            ...prev,
            contacts: prev.contacts.filter((_, i) => i !== index)
        }));
    }, []);

    const updateContact = useCallback((index: number, field: keyof CustomerContact, value: string) => {
        setFormData(prev => {
            const newContacts = [...prev.contacts];
            newContacts[index] = { ...newContacts[index], [field]: value };
            return { ...prev, contacts: newContacts };
        });
    }, []);

    const save = async () => {
        if (!formData.nm_customers) {
            setError("Nama Company harus diisi");
            return false;
        }
        if (!formData.customers_address) {
            setError("Address harus diisi");
            return false;
        }
        if (!formData.customers_address_invoice) {
            setError("Address Invoice harus diisi");
            return false;
        }
        if (!formData.customers_mobile) {
            setError("Mobile harus diisi");
            return false;
        }

        setIsSaving(true);
        setError(null);
        try {
            if (initialId) {
                const res = await customersApi.updateCustomer(initialId, formData);
                setIsSaving(false);
                return res.success;
            } else {
                const res = await customersApi.createCustomer(formData);
                setIsSaving(false);
                return res.success;
            }
        } catch (e: any) {
            setIsSaving(false);
            setError(e.message || 'Terjadi kesalahan saat menyimpan');
            return false;
        }
    };

    return {
        formData,
        provinces,
        regencies,
        isSaving,
        error,
        initialLoadDone,
        updateField,
        handleProvinceChange,
        addContact,
        removeContact,
        updateContact,
        save,
        loadInitialData,
    };
}
