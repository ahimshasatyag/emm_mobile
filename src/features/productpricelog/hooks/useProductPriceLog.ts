import { useCallback } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { fetchLogs, clearError } from '../stores/productPriceLogSlice';

export function useProductPriceLog() {
    const dispatch = useAppDispatch();
    const state = useAppSelector(state => state.productPriceLog || { logs: [], isLoading: false, error: null });

    const loadLogs = useCallback(async () => {
        try {
            await dispatch(fetchLogs()).unwrap();
        } catch (error: any) {
            const msg = typeof error === 'string' ? error : error.message;
            throw new Error(msg || 'Gagal mengambil data log harga');
        }
    }, [dispatch]);

    const resetError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    return {
        ...state,
        loadLogs,
        resetError,
    };
}
