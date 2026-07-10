import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../stores';
import { fetchPoList, fetchPoById, savePo, clearSelectedItem, clearError } from '../stores/poSlice';
import { PoHeader } from '../types/po.types';

export const usePo = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items, selectedItem, isLoadingList, isLoadingDetail, isSaving, error } = useSelector((state: RootState) => state.po);
    const [searchQuery, setSearchQuery] = useState('');

    const loadList = useCallback(async () => {
        await dispatch(fetchPoList());
    }, [dispatch]);

    const loadDetail = useCallback(async (id: string) => {
        await dispatch(fetchPoById(id));
    }, [dispatch]);

    const handleSave = useCallback(async (data: any) => {
        return await dispatch(savePo(data)).unwrap();
    }, [dispatch]);

    const clearSelection = useCallback(() => {
        dispatch(clearSelectedItem());
    }, [dispatch]);

    const clearErr = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    // Simple client-side search logic
    const filteredItems = items.filter((item: PoHeader) => {
        const searchLower = searchQuery.toLowerCase();
        return (
            item.code_po.toLowerCase().includes(searchLower) ||
            item.nm_suppliers.toLowerCase().includes(searchLower)
        );
    });

    return {
        items: filteredItems,
        selectedItem,
        isLoadingList,
        isLoadingDetail,
        isSaving,
        error,
        searchQuery,
        setSearchQuery,
        loadList,
        loadDetail,
        handleSave,
        clearSelection,
        clearErr
    };
};
