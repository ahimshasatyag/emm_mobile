import { useCallback } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import {
    fetchRequests,
    fetchProducts,
    fetchRequestById,
    createRequest,
    updateRequest,
    changeStatus,
    clearSelectedRequest,
    clearError
} from '../stores/productPriceReqSlice';
import { ProductPriceReqPayload } from '../types/productpricereq.types';

export function useProductPriceReq() {
    const dispatch = useAppDispatch();
    const state = useAppSelector(state => state.productPriceReq);

    const loadRequests = useCallback(async () => {
        try {
            await dispatch(fetchRequests()).unwrap();
        } catch (error: any) {
            const msg = typeof error === 'string' ? error : error.message;
            throw new Error(msg || 'Gagal mengambil data permintaan harga');
        }
    }, [dispatch]);

    const loadProducts = useCallback(async () => {
        try {
            await dispatch(fetchProducts()).unwrap();
        } catch (error: any) {
            const msg = typeof error === 'string' ? error : error.message;
            throw new Error(msg || 'Gagal mengambil data produk');
        }
    }, [dispatch]);

    const loadRequestDetail = useCallback(async (id: string) => {
        try {
            await dispatch(fetchRequestById(id)).unwrap();
        } catch (error: any) {
            const msg = typeof error === 'string' ? error : error.message;
            throw new Error(msg || 'Gagal mengambil detail pengajuan');
        }
    }, [dispatch]);

    const createNewRequest = useCallback(async (payload: ProductPriceReqPayload) => {
        try {
            const result = await dispatch(createRequest(payload)).unwrap();
            return result.id;
        } catch (error: any) {
            const msg = typeof error === 'string' ? error : error.message;
            throw new Error(msg || 'Gagal membuat pengajuan');
        }
    }, [dispatch]);

    const updateExistingRequest = useCallback(async (id: string, payload: ProductPriceReqPayload) => {
        try {
            await dispatch(updateRequest({ id, payload })).unwrap();
            return true;
        } catch (error: any) {
            const msg = typeof error === 'string' ? error : error.message;
            throw new Error(msg || 'Gagal memperbarui pengajuan');
        }
    }, [dispatch]);

    const changeRequestStatus = useCallback(async (id: string, status: string) => {
        try {
            await dispatch(changeStatus({ id, status })).unwrap();
            return true;
        } catch (error: any) {
            const msg = typeof error === 'string' ? error : error.message;
            throw new Error(msg || 'Gagal memperbarui status');
        }
    }, [dispatch]);

    const resetDetail = useCallback(() => {
        dispatch(clearSelectedRequest());
    }, [dispatch]);

    const resetError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    const validateForm = useCallback((productId?: string): string | null => {
        if (!productId) return 'Silakan pilih produk terlebih dahulu';
        return null;
    }, []);

    return {
        ...state,
        loadRequests,
        loadProducts,
        loadRequestDetail,
        createNewRequest,
        updateExistingRequest,
        changeRequestStatus,
        resetDetail,
        resetError,
        validateForm,
    };
}
