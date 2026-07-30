import { useEffect } from 'react';
import { useQuotationStore } from '../stores/useQuotationStore';
import { Quotation } from '../types/quotation.types';

export const useQuotations = () => {
    const { 
        quotations, 
        isLoading, 
        error, 
        fetchQuotations, 
        addQuotation, 
        updateQuotation, 
        deleteQuotation 
    } = useQuotationStore();

    useEffect(() => {
        // Fetch only if empty, or you can force fetch
        if (quotations.length === 0) {
            fetchQuotations();
        }
    }, []);

    const handleAddQuotation = async (data: Quotation) => {
        await addQuotation(data);
    };

    const handleUpdateQuotation = async (id: string, data: Quotation) => {
        await updateQuotation(id, data);
    };

    const handleDeleteQuotation = async (id: string) => {
        await deleteQuotation(id);
    };

    const validateForm = (formData: any) => {
        if (!formData.customer_name && !formData.sales_person_name) {
            return 'Semua field harus diisi';
        }
        if (!formData.customer_name) return 'Customer harus dipilih';
        if (!formData.sales_person_name) return 'Sales harus dipilih';
        if (formData.items.length === 0) return 'Barang tidak boleh kosong';
        return '';
    };

    const validateAddItem = (formData: any) => {
        if (!formData.sales_person_name) {
            return 'Silahkan pilih Sales Person';
        }
        return '';
    };

    return {
        quotations,
        isLoading,
        error,
        refresh: fetchQuotations,
        addQuotation: handleAddQuotation,
        updateQuotation: handleUpdateQuotation,
        deleteQuotation: handleDeleteQuotation,
        validateForm,
        validateAddItem
    };
};
