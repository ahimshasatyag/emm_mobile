import { useState } from 'react';
import { LogbookProduct } from '../types/logbookproduct.types';

export function useLogbookProductForm(initialData?: LogbookProduct) {
    const [formData, setFormData] = useState<Partial<LogbookProduct>>({
        id_product: initialData?.id_product || '',
        id_type_kerusakan: initialData?.id_type_kerusakan || '',
        masalah: initialData?.masalah || '',
        solusi: initialData?.solusi || '',
        catatan: initialData?.catatan || '',
        date_log_book: initialData?.date_log_book || new Date().toISOString().split('T')[0],
    });

    const updateField = (field: keyof LogbookProduct, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const resetForm = () => {
        setFormData({
            id_product: '',
            id_type_kerusakan: '',
            masalah: '',
            solusi: '',
            catatan: '',
            date_log_book: new Date().toISOString().split('T')[0],
        });
    };

    const validate = () => {
        if (!formData.id_product) return "Product wajib diisi";
        if (!formData.id_type_kerusakan) return "Tipe kerusakan wajib diisi";
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
