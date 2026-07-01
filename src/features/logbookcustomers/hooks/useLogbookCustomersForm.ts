import { useState } from 'react';
import { LogbookCustomer } from '../types/logbookcustomers.types';

export function useLogbookCustomersForm(initialData?: LogbookCustomer) {
    const [formData, setFormData] = useState<Partial<LogbookCustomer>>({
        id_customers: initialData?.id_customers || '',
        masalah: initialData?.masalah || '',
        solusi: initialData?.solusi || '',
        catatan: initialData?.catatan || '',
        date_log_book: initialData?.date_log_book || new Date().toISOString().split('T')[0],
    });

    const updateField = (field: keyof LogbookCustomer, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const resetForm = () => {
        setFormData({
            id_customers: '',
            masalah: '',
            solusi: '',
            catatan: '',
            date_log_book: new Date().toISOString().split('T')[0],
        });
    };

    const validate = () => {
        if (!formData.id_customers) return "Customer wajib diisi";
        if (!formData.masalah) return "Masalah wajib diisi";
        if (!formData.solusi) return "Solusi wajib diisi";
        return null;
    };

    return {
        formData,
        updateField,
        resetForm,
        validate
    };
}
