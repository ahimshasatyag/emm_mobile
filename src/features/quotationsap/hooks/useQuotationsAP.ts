import { useCallback, useState, useMemo } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import {
    fetchQuotationsAP,
    fetchQuotationAPById,
    createQuotationAP,
    updateQuotationAP,
    confirmQuotationAP,
    cancelQuotationAP,
    clearSelectedItem,
    clearError
} from '../stores/quotationsapSlice';
import { notificationService } from '../../../services/notification/notificationService';
import { quotationsapApi } from '../api/quotationsapApi';

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
    const authUser = useAppSelector((state) => state.auth.user);

    const [searchQuery, setSearchQuery] = useState('');

    const filteredItems = useMemo(() => {
        if (!searchQuery.trim()) return items;
        const lowerQuery = searchQuery.toLowerCase();
        return items.filter(item =>
            item.code_po?.toLowerCase()?.includes(lowerQuery) ||
            item.nm_suppliers?.toLowerCase()?.includes(lowerQuery) ||
            item.status_po?.toLowerCase()?.includes(lowerQuery)
        );
    }, [items, searchQuery]);

    const loadList = useCallback(async () => {
        await dispatch(fetchQuotationsAP());
    }, [dispatch]);

    const loadDetail = useCallback(async (id: string, mode: 'initial' | 'refresh' | 'silent' = 'initial') => {
        await dispatch(fetchQuotationAPById(id));
    }, [dispatch]);

    const create = useCallback(async (data: FormData, displayCode?: string) => {
        const result = await dispatch(createQuotationAP(data)).unwrap();
        await notificationService.store({
            user_id: authUser?.id_user ?? 1,
            id_users_level: authUser?.id_users_level ?? 1,
            kode_trans: result?.kode || 'QAP BARU',
            judul: 'Quotation AP Baru',
            pesan: `Quotation AP baru berhasil dibuat oleh ${authUser?.nm_users}`,
            action: 'Create'
        }).catch(() => { });
        return result;
    }, [dispatch, authUser]);

    const update = useCallback(async (id: string, data: FormData, displayCode?: string) => {
        const result = await dispatch(updateQuotationAP({ id, data })).unwrap();
        await notificationService.store({
            user_id: authUser?.id_user ?? 1,
            id_users_level: authUser?.id_users_level ?? 1,
            kode_trans: displayCode || id,
            judul: 'Quotation AP Diperbarui',
            pesan: `Quotation AP ${displayCode || id} berhasil diperbarui oleh ${authUser?.nm_users}`,
            action: 'Update'
        }).catch(() => { });
        return result;
    }, [dispatch, authUser]);

    const confirm = useCallback(async (id: string, displayCode?: string) => {
        const result = await dispatch(confirmQuotationAP(id)).unwrap();
        await notificationService.store({
            user_id: authUser?.id_user ?? 1,
            id_users_level: authUser?.id_users_level ?? 1,
            kode_trans: displayCode || id,
            judul: 'Quotation AP Dikonfirmasi',
            pesan: `Quotation AP ${displayCode || id} telah dikonfirmasi menjadi PO oleh ${authUser?.nm_users}`,
            action: 'Approve'
        }).catch(() => { });
        return result;
    }, [dispatch, authUser]);

    const cancel = useCallback(async (id: string, displayCode?: string) => {
        const result = await dispatch(cancelQuotationAP(id)).unwrap();
        await notificationService.store({
            user_id: authUser?.id_user ?? 1,
            id_users_level: authUser?.id_users_level ?? 1,
            kode_trans: displayCode || id,
            judul: 'Quotation AP Dibatalkan',
            pesan: `Quotation AP ${displayCode || id} telah dibatalkan oleh ${authUser?.nm_users}`,
            action: 'Update'
        }).catch(() => { });
        return result;
    }, [dispatch, authUser]);

    const supportData = useCallback(async () => {
        return await quotationsapApi.supportData();
    }, []);

    const getProductDetail = useCallback(async (id_product: string) => {
        return await quotationsapApi.getProductDetail(id_product);
    }, []);

    const getLokasi = useCallback(async (id_gudang: string) => {
        return await quotationsapApi.getLokasi(id_gudang);
    }, []);

    const getMataUangDefault = useCallback(async (id_supplier: string) => {
        return await quotationsapApi.getMataUangDefault(id_supplier);
    }, []);

    const clearSelection = useCallback(() => {
        dispatch(clearSelectedItem());
    }, [dispatch]);

    const clearErr = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    const validateForm = (data: any, detailsLength: number): string | null => {
        if (!data.id_suppliers) return 'Supplier wajib diisi';
        if (!data.id_gudang) return 'Gudang wajib diisi';
        if (!data.date_po) return 'Order Date wajib diisi';
        if (detailsLength === 0) return 'Barang wajib diisi minimal 1';
        return null;
    };

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
        create,
        update,
        confirm,
        cancel,
        supportData,
        getProductDetail,
        getLokasi,
        getMataUangDefault,
        clearSelection,
        clearErr,
        validateForm
    };
}
