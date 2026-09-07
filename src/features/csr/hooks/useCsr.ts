import { useCallback } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import {
    fetchCsrs,
    fetchCsrById,
    createCsr,
    updateCsr,
    confirmCsr,
    cancelCsr,
    clearCurrentRequest,
    fetchFormOptions
} from '../stores/csrSlice';
import { CsrPayload } from '../types/csr.types';
import { fetchNotifications } from '../../../stores/notificationSlice';
import { notificationService } from '../../../services/notification/notificationService';

export const useCsr = () => {
    const dispatch = useAppDispatch();
    const { requests, currentRequest, formOptions, isLoading, error } = useAppSelector(state => state.csr);
    const authUser = useAppSelector(state => state.auth.user);

    const loadRequests = useCallback(() => {
        dispatch(fetchCsrs());
    }, [dispatch]);

    const loadRequestById = useCallback((id: string) => {
        dispatch(fetchCsrById(id));
    }, [dispatch]);

    const submitRequest = useCallback(async (payload: CsrPayload) => {
        const result = await dispatch(createCsr(payload)).unwrap();
        if (authUser?.id_user) {
            const csrId = result?.kode || result?.id_afs_csr || result?.csr_code || 'Baru';
            const csrNumber = typeof csrId === 'string' ? csrId.split('/').pop() : csrId;
            await notificationService.store({
                user_id: authUser.id_user,
                id_users_level: authUser.id_users_level ?? 1,
                kode_trans: 'CSR',
                judul: 'CSR Baru',
                pesan: `CSR #${csrNumber} berhasil ditambahkan oleh ${authUser.nm_users}`,
                action: 'Create'
            }).catch(() => { });
            dispatch(fetchNotifications(authUser.id_user));
        }
        return result;
    }, [dispatch, authUser]);

    const editRequest = useCallback(async (id: string, payload: Partial<CsrPayload>) => {
        const result = await dispatch(updateCsr({ id, payload })).unwrap();
        if (authUser?.id_user) {
            const csrNumber = id.split('/').pop() || id;
            await notificationService.store({
                user_id: authUser.id_user,
                id_users_level: authUser.id_users_level ?? 1,
                kode_trans: id,
                judul: 'CSR Diperbarui',
                pesan: `CSR #${csrNumber} berhasil diperbarui oleh ${authUser.nm_users}`,
                action: 'Update'
            }).catch(() => { });
            dispatch(fetchNotifications(authUser.id_user));
        }
        return result;
    }, [dispatch, authUser]);

    const submitConfirmCsr = useCallback(async (id: string, payload?: any) => {
        const result = await dispatch(confirmCsr({ id, payload })).unwrap();
        if (authUser?.id_user) {
            const csrNumber = id.split('/').pop() || id;
            await notificationService.store({
                user_id: authUser.id_user,
                id_users_level: authUser.id_users_level ?? 1,
                kode_trans: id,
                judul: 'CSR Dikonfirmasi',
                pesan: `CSR #${csrNumber} berhasil dikonfirmasi oleh ${authUser.nm_users}`,
                action: 'Update'
            }).catch(() => { });
            dispatch(fetchNotifications(authUser.id_user));
        }
        return result;
    }, [dispatch, authUser]);

    const submitCancelCsr = useCallback(async (id: string, payload: any) => {
        const result = await dispatch(cancelCsr({ id, ...payload })).unwrap();
        if (authUser?.id_user) {
            const csrNumber = id.split('/').pop() || id;
            await notificationService.store({
                user_id: authUser.id_user,
                id_users_level: authUser.id_users_level ?? 1,
                kode_trans: id,
                judul: 'CSR Dibatalkan',
                pesan: `CSR #${csrNumber} telah dibatalkan oleh ${authUser.nm_users}`,
                action: 'Delete'
            }).catch(() => { });
            dispatch(fetchNotifications(authUser.id_user));
        }
        return result;
    }, [dispatch, authUser]);

    const fetchOptions = useCallback(() => {
        dispatch(fetchFormOptions());
    }, [dispatch]);

    const resetCurrentRequest = useCallback(() => {
        dispatch(clearCurrentRequest());
    }, [dispatch]);

    const validateForm = (formData: Partial<CsrPayload>): string | null => {
        if (!formData.id_product && !formData.customers && !formData.id_karyawan && !formData.lokasi && !formData.sts_pasang && !formData.lap_kerusakan) {
            return 'Semua field wajib diisi!';
        }

        if (!formData.id_product) return 'Product Name harus diisi';
        if (!formData.customers) return 'Customer Name harus diisi';
        if (!formData.id_karyawan) return 'Requestor harus diisi';
        if (!formData.lokasi) return 'Lokasi harus diisi';
        if (!formData.sts_pasang) return 'Status Pemasangan harus diisi';
        if (!formData.lap_kerusakan) return 'Catatan Kerusakan harus diisi';

        return null;
    };

    return {
        requests,
        currentRequest,
        formOptions,
        isLoading,
        error,
        loadRequests,
        loadRequestById,
        submitRequest,
        editRequest,
        submitConfirmCsr,
        submitCancelCsr,
        fetchOptions,
        resetCurrentRequest,
        validateForm
    };
};
