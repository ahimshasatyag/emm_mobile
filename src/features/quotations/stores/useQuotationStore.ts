import { create } from 'zustand';
import { Quotation } from '../types/quotation.types';
import { DUMMY_QUOTATIONS } from '../data/dummyQuotations';

interface QuotationState {
    quotations: Quotation[];
    isLoading: boolean;
    error: string | null;
    
    fetchQuotations: () => Promise<void>;
    addQuotation: (quotation: Quotation) => Promise<void>;
    updateQuotation: (id: string, quotation: Quotation) => Promise<void>;
    deleteQuotation: (id: string) => Promise<void>;
}

export const useQuotationStore = create<QuotationState>((set) => ({
    quotations: [],
    isLoading: false,
    error: null,

    fetchQuotations: async () => {
        set({ isLoading: true, error: null });
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            set({ quotations: DUMMY_QUOTATIONS, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    addQuotation: async (quotation) => {
        set({ isLoading: true, error: null });
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            set((state) => ({ 
                quotations: [quotation, ...state.quotations],
                isLoading: false 
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    updateQuotation: async (id, updatedQuotation) => {
        set({ isLoading: true, error: null });
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            set((state) => ({
                quotations: state.quotations.map(q => q.id_quotation === id ? updatedQuotation : q),
                isLoading: false
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    deleteQuotation: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            set((state) => ({
                quotations: state.quotations.filter(q => q.id_quotation !== id),
                isLoading: false
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    }
}));
