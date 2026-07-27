import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../stores';
import {
    fetchIncshipments,
    fetchIncshipmentDetail,
    assignSerialNumber,
    printBarcode,
    receiveGoods,
    clearSelectedIncshipment,
    clearIncshipmentError
} from '../stores/incshipmentSlice';

export function useIncshipment() {
    const dispatch = useDispatch<AppDispatch>();
    const { items, selectedItem, isLoadingList, isLoadingDetail, isSaving, error } = useSelector((state: RootState) => state.incshipment);
    const [searchQuery, setSearchQuery] = useState('');

    const loadList = useCallback(async () => {
        return await dispatch(fetchIncshipments()).unwrap();
    }, [dispatch]);

    const loadDetail = useCallback(async (id: string) => {
        return await dispatch(fetchIncshipmentDetail(id)).unwrap();
    }, [dispatch]);

    const handleAssignSN = useCallback(async (id: string) => {
        return await dispatch(assignSerialNumber(id)).unwrap();
    }, [dispatch]);

    const handlePrintBarcode = useCallback(async (id: string) => {
        return await dispatch(printBarcode(id)).unwrap();
    }, [dispatch]);

    const handleReceiveGoods = useCallback(async (id: string, selectedItemIds: string[]) => {
        return await dispatch(receiveGoods({ id, selectedItemIds })).unwrap();
    }, [dispatch]);

    const clearSelection = useCallback(() => {
        dispatch(clearSelectedIncshipment());
    }, [dispatch]);

    const validateReceive = (selectedItemIds: string[]): string | null => {
        if (selectedItemIds.length === 0) {
            return 'Pilih barang minimal 1';
        }
        return null;
    };

    const clearError = useCallback(() => {
        dispatch(clearIncshipmentError());
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
        handleAssignSN,
        handlePrintBarcode,
        handleReceiveGoods,
        validateReceive,
        clearSelection,
        clearError
    };
}
