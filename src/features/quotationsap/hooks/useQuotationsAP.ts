import { useCallback, useState } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import {
    fetchQuotationsAP,
    fetchQuotationAPById,
    saveQuotationAP,
    clearSelectedItem,
    clearError
} from '../stores/quotationsapSlice';
import { QuotationAP } from '../types/quotationsap.types';

export function useQuotationsAP() {
    const dispatch = useAppDispatch();
    const {
        items,
        selectedItem,
        isLoadingList,
        isLoadingDetail,
        isSaving,
        error
    } = useAppSelector((state) => state.quotationsap);

    const [searchQuery, setSearchQuery] = useState('');

    const loadList = useCallback(async () => {
        await dispatch(fetchQuotationsAP());
    }, [dispatch]);

    const loadDetail = useCallback(async (id: string, mode: 'initial' | 'refresh' | 'silent' = 'initial') => {
        // Here we just delegate to fetchQuotationAPById, but in practice 
        // the slice handles isLoadingDetail which might act as 'initial'
        // For silent refresh without flashing skeleton, we could manage separate loading states 
        // if needed, or just let the slice handle it as per the current standard.
        await dispatch(fetchQuotationAPById(id));
    }, [dispatch]);

    const save = useCallback(async (data: QuotationAP) => {
        return await dispatch(saveQuotationAP(data)).unwrap();
    }, [dispatch]);

    const clearSelection = useCallback(() => {
        dispatch(clearSelectedItem());
    }, [dispatch]);

    const clearErr = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    return {
        items,
        selectedItem,
        isLoadingList,
        isLoadingDetail,
        isSaving,
        error,
        searchQuery,
        setSearchQuery,
        loadList,
        loadDetail,
        save,
        clearSelection,
        clearErr
    };
}
