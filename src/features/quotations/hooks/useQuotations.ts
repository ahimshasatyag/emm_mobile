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

    return {
        quotations,
        isLoading,
        error,
        refresh: fetchQuotations,
        addQuotation: handleAddQuotation,
        updateQuotation: handleUpdateQuotation,
        deleteQuotation: handleDeleteQuotation
    };
};
