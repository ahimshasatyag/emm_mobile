import { useCallback, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../stores';
import { fetchPRList, fetchPRDetail, createPR, updatePR, ajukanPR, clearCurrentDetail, clearError } from '../stores/purchaserequisitionsSlice';
import { PurchaseRequisition } from '../types/purchaserequisitions';

export const usePurchaseRequisitions = () => {
    const dispatch = useDispatch<AppDispatch>();
    
    const { items, currentDetail, isLoadingList, isLoadingDetail, isSaving, error } = useSelector(
        (state: RootState) => state.purchaserequisitions
    );

    const [searchQuery, setSearchQuery] = useState('');

    const filteredItems = useMemo(() => {
        if (!searchQuery.trim()) return items;
        const lowerQuery = searchQuery.toLowerCase();
        return items.filter(item => 
            item.code_pr?.toLowerCase()?.includes(lowerQuery) || 
            item.username?.toLowerCase()?.includes(lowerQuery) ||
            item.status_pr?.toLowerCase()?.includes(lowerQuery)
        );
    }, [items, searchQuery]);

    const loadList = useCallback(() => {
        dispatch(fetchPRList());
    }, [dispatch]);

    const loadDetail = useCallback((id: string) => {
        dispatch(fetchPRDetail(id));
    }, [dispatch]);

    const create = useCallback(async (data: Partial<PurchaseRequisition>) => {
        return dispatch(createPR(data)).unwrap();
    }, [dispatch]);

    const update = useCallback(async (id_pr: string, data: Partial<PurchaseRequisition>) => {
        return dispatch(updatePR({ id_pr, data })).unwrap();
    }, [dispatch]);

    const ajukan = useCallback(async (id_pr: string) => {
        return dispatch(ajukanPR(id_pr)).unwrap();
    }, [dispatch]);

    const resetDetail = useCallback(() => {
        dispatch(clearCurrentDetail());
    }, [dispatch]);

    return {
        items: filteredItems,
        currentDetail,
        isLoadingList,
        isLoadingDetail,
        isSaving,
        error,
        searchQuery,
        setSearchQuery,
        loadList,
        loadDetail,
        create,
        update,
        ajukan,
        resetDetail,
        clearError: () => dispatch(clearError())
    };
};

export const validateForm = (formData: any, details: any[]): string | null => {
    if (!formData.username?.trim()) return 'Responsible wajib diisi';
    if (details.length === 0) return 'Daftar barang tidak boleh kosong';
    return null;
};

export const validateProductForm = (productData: any): string | null => {
    if (!productData.code_product?.trim()) return 'Kode barang wajib diisi';
    return null;
};

export const validateCreateQuotation = (selectedItems: any[]): string | null => {
    if (!selectedItems || selectedItems.length === 0) return 'Pilih PR Minimal 1';
    return null;
};
