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
import { notificationService } from '../../../services/notification/notificationService';

export const useSO = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items, currentSO, isLoading, error } = useSelector((state: RootState) => state.so);
    const authUser = useSelector((state: RootState) => state.auth.user);

    const loadList = useCallback(() => {
        dispatch(fetchSOList());
    }, [dispatch]);

    const loadDetail = useCallback((id: string) => {
        dispatch(getSOById(id));
    }, [dispatch]);

    const addSO = useCallback(async (data: SalesOrder) => {
        const result = await dispatch(createSO(data)).unwrap();
        await notificationService.store({
            user_id: authUser?.id_user ?? 1,
            id_users_level: authUser?.id_users_level ?? 1,
            kode_trans: 'SO',
            judul: 'Sales Order Baru',
            pesan: `Sales Order berhasil ditambahkan oleh ${authUser?.nm_users}`,
            action: 'Create'
        }).catch(() => {});
        return result;
    }, [dispatch, authUser]);

    const modifySO = useCallback(async (id: string, data: Partial<SalesOrder>) => {
        const result = await dispatch(updateSO({ id, data })).unwrap();
        await notificationService.store({
            user_id: authUser?.id_user ?? 1,
            id_users_level: authUser?.id_users_level ?? 1,
            kode_trans: 'SO',
            judul: 'Sales Order Diperbarui',
            pesan: `Sales Order berhasil diperbarui oleh ${authUser?.nm_users}`,
            action: 'Update'
        }).catch(() => {});
        return result;
    }, [dispatch, authUser]);

    const resetCurrent = useCallback(() => {
        dispatch(clearCurrentSO());
    }, [dispatch]);

    const dismissError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    const handleConfirmSO = useCallback(async (id_so: string) => {
        const result = await dispatch(confirmSO(id_so)).unwrap();
        await notificationService.store({
            user_id: authUser?.id_user ?? 1,
            id_users_level: authUser?.id_users_level ?? 1,
            kode_trans: 'SO',
            judul: 'Sales Order Dikonfirmasi',
            pesan: `Sales Order berhasil dikonfirmasi oleh ${authUser?.nm_users}`,
            action: 'Update'
        }).catch(() => {});
        return result;
    }, [dispatch, authUser]);

    const handleCheckPaymentSO = useCallback(async (id_so: string, tgl_status?: string) => {
        const result = await dispatch(checkPaymentSO({ id_so, tgl_status })).unwrap();
        await notificationService.store({
            user_id: authUser?.id_user ?? 1,
            id_users_level: authUser?.id_users_level ?? 1,
            kode_trans: 'SO',
            judul: 'Check Payment Sales Order',
            pesan: `Check Payment Sales Order berhasil diproses oleh ${authUser?.nm_users}`,
            action: 'Update'
        }).catch(() => {});
        return result;
    }, [dispatch, authUser]);

    const handleCancelSO = useCallback(async (id_so: string, alasan: string, username?: string) => {
        const result = await dispatch(cancelSO({ id_so, alasan, username })).unwrap();
        await notificationService.store({
            user_id: authUser?.id_user ?? 1,
            id_users_level: authUser?.id_users_level ?? 1,
            kode_trans: 'SO',
            judul: 'Sales Order Dibatalkan',
            pesan: `Sales Order dibatalkan oleh ${authUser?.nm_users} karena: ${alasan}`,
            action: 'Update'
        }).catch(() => {});
        return result;
    }, [dispatch, authUser]);

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
