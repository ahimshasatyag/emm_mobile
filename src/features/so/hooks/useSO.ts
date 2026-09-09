import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../stores';
import {
    fetchSOList,
    getSOById,
    createSO,
    updateSO,
    clearCurrentSO,
    clearError,
    confirmSO,
    checkPaymentSO,
    cancelSO
} from '../stores/soSlice';
import { SalesOrder } from '../types/so.types';
import { useCallback } from 'react';

export const useSO = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items, currentSO, isLoading, error } = useSelector((state: RootState) => state.so);

    const loadList = useCallback(() => {
        dispatch(fetchSOList());
    }, [dispatch]);

    const loadDetail = useCallback((id: string) => {
        dispatch(getSOById(id));
    }, [dispatch]);

    const addSO = useCallback(async (data: SalesOrder) => {
        return await dispatch(createSO(data)).unwrap();
    }, [dispatch]);

    const modifySO = useCallback(async (id: string, data: Partial<SalesOrder>) => {
        return await dispatch(updateSO({ id, data })).unwrap();
    }, [dispatch]);

    const resetCurrent = useCallback(() => {
        dispatch(clearCurrentSO());
    }, [dispatch]);

    const dismissError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    const handleConfirmSO = useCallback(async (id_so: string) => {
        return await dispatch(confirmSO(id_so)).unwrap();
    }, [dispatch]);

    const handleCheckPaymentSO = useCallback(async (id_so: string, tgl_status?: string) => {
        return await dispatch(checkPaymentSO({ id_so, tgl_status })).unwrap();
    }, [dispatch]);

    const handleCancelSO = useCallback(async (id_so: string, alasan: string, username?: string) => {
        return await dispatch(cancelSO({ id_so, alasan, username })).unwrap();
    }, [dispatch]);

    return {
        items,
        currentSO,
        isLoading,
        error,
        loadList,
        loadDetail,
        addSO,
        modifySO,
        resetCurrent,
        dismissError,
        confirmSO: handleConfirmSO,
        checkPaymentSO: handleCheckPaymentSO,
        cancelSO: handleCancelSO
    };
};
