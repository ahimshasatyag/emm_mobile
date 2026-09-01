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
import { notificationService } from '../../../services/notification/notificationService';

export function useProductPriceReq() {
    const dispatch = useAppDispatch();
    const state = useAppSelector(state => state.productPriceReq);
    const authUser = useAppSelector(state => state.auth.user);

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
            const finalPayload = {
                ...payload,
                username: authUser?.username
            };
            const result = await dispatch(createRequest(finalPayload)).unwrap();

            await notificationService.store({
                user_id: authUser?.id_user ?? 1,
                id_users_level: authUser?.id_users_level ?? 1,
                kode_trans: 'PRODUCT PRICE REQ',
                judul: 'Product Price Request Baru',
                pesan: `Product Price Request berhasil dibuat oleh ${authUser?.nm_users}`,
                action: 'Create'
            }).catch(() => { });

            return result.id;
        } catch (error: any) {
            const msg = typeof error === 'string' ? error : error.message;
            throw new Error(msg || 'Gagal membuat pengajuan');
        }
    }, [dispatch, authUser]);

    const updateExistingRequest = useCallback(async (id: string, payload: ProductPriceReqPayload) => {
        try {
            await dispatch(updateRequest({ id, payload })).unwrap();

            await notificationService.store({
                user_id: authUser?.id_user ?? 1,
                id_users_level: authUser?.id_users_level ?? 1,
                kode_trans: 'PRODUCT PRICE REQ',
                judul: 'Product Price Request Diperbarui',
                pesan: `Product Price Request berhasil diperbarui oleh ${authUser?.nm_users}`,
                action: 'Update'
            }).catch(() => { });

            return true;
        } catch (error: any) {
            const msg = typeof error === 'string' ? error : error.message;
            throw new Error(msg || 'Gagal memperbarui pengajuan');
        }
    }, [dispatch, authUser]);

    const changeRequestStatus = useCallback(async (id: string, status: string) => {
        try {
            await dispatch(changeStatus({ id, status })).unwrap();

            await notificationService.store({
                user_id: authUser?.id_user ?? 1,
                id_users_level: authUser?.id_users_level ?? 1,
                kode_trans: 'PRODUCT PRICE REQ',
                judul: 'Product Price Request Diperbarui',
                pesan: `Product Price Request diubah menjadi ${status} oleh ${authUser?.nm_users}`,
                action: 'Update Status'
            }).catch(() => { });

            return true;
        } catch (error: any) {
            const msg = typeof error === 'string' ? error : error.message;
            throw new Error(msg || 'Gagal memperbarui status');
        }
    }, [dispatch, authUser]);

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
