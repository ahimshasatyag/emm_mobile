import { useCallback, useState, useMemo } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import {
    fetchPoList,
    fetchPoById,
    createPo,
    updatePo,
    confirmPo,
    cancelPo,
    clearSelectedItem,
    clearError
} from '../stores/poSlice';
import { notificationService } from '../../../services/notification/notificationService';
import { poAPI } from '../api/poAPI';

export function usePo() {
    const dispatch = useAppDispatch();
    const {
        items,
        selectedItem,
        isLoadingList,
        isLoadingDetail,
        isSaving,
        error
    } = useAppSelector((state) => state.po);
    const authUser = useAppSelector((state) => state.auth.user);

    const [searchQuery, setSearchQuery] = useState('');

    const filteredItems = useMemo(() => {
        const safeItems = Array.isArray(items) ? items : [];
        if (!searchQuery.trim()) return safeItems;
        const lowerQuery = searchQuery.toLowerCase();
        return safeItems.filter(item =>
            item?.code_po?.toLowerCase()?.includes(lowerQuery) ||
            item?.nm_suppliers?.toLowerCase()?.includes(lowerQuery) ||
            item?.status_po?.toLowerCase()?.includes(lowerQuery)
        );
    }, [items, searchQuery]);

    const loadList = useCallback(async () => {
        await dispatch(fetchPoList(undefined));
    }, [dispatch]);

    const loadDetail = useCallback(async (id: string, mode: 'initial' | 'refresh' | 'silent' = 'initial') => {
        await dispatch(fetchPoById(id));
    }, [dispatch]);

    const create = useCallback(async (data: FormData, displayCode?: string) => {
        const result = await dispatch(createPo(data)).unwrap();
        await notificationService.store({
            user_id: authUser?.id_user ?? 1,
            id_users_level: authUser?.id_users_level ?? 1,
            kode_trans: result?.kode || 'PO BARU',
            judul: 'PO Baru',
            pesan: `PO baru berhasil dibuat oleh ${authUser?.nm_users}`,
            action: 'Create'
        }).catch(() => { });
        return result;
    }, [dispatch, authUser]);

    const update = useCallback(async (id: string, data: FormData, displayCode?: string) => {
        const result = await dispatch(updatePo({ id, data })).unwrap();
        await notificationService.store({
            user_id: authUser?.id_user ?? 1,
            id_users_level: authUser?.id_users_level ?? 1,
            kode_trans: displayCode || id,
            judul: 'PO Diperbarui',
            pesan: `PO ${displayCode || id} berhasil diperbarui oleh ${authUser?.nm_users}`,
            action: 'Update'
        }).catch(() => { });
        return result;
    }, [dispatch, authUser]);

    const confirm = useCallback(async (id: string, displayCode?: string) => {
        const result = await dispatch(confirmPo(id)).unwrap();
        await notificationService.store({
            user_id: authUser?.id_user ?? 1,
            id_users_level: authUser?.id_users_level ?? 1,
            kode_trans: displayCode || id,
            judul: 'PO Dikonfirmasi',
            pesan: `PO ${displayCode || id} telah dikonfirmasi oleh ${authUser?.nm_users}`,
            action: 'Approve'
        }).catch(() => { });
        return result;
    }, [dispatch, authUser]);

    const cancel = useCallback(async (id: string, displayCode?: string) => {
        const result = await dispatch(cancelPo(id)).unwrap();
        await notificationService.store({
            user_id: authUser?.id_user ?? 1,
            id_users_level: authUser?.id_users_level ?? 1,
            kode_trans: displayCode || id,
            judul: 'PO Dibatalkan',
            pesan: `PO ${displayCode || id} telah dibatalkan oleh ${authUser?.nm_users}`,
            action: 'Update'
        }).catch(() => { });
        return result;
    }, [dispatch, authUser]);

    const clearSelection = useCallback(() => {
        dispatch(clearSelectedItem());
    }, [dispatch]);

    const supportData = useCallback(async () => {
        return await poAPI.supportData();
    }, []);

    const getMataUangDefault = useCallback(async (id_supplier: string) => {
        return await poAPI.getMataUangDefault(id_supplier);
    }, []);

    const validateForm = (
        supplier: string | null,
        warehouse: string | null,
        orderDate: Date | null,
        selectedProducts: any[]
    ) => {
        if (!supplier) return { isValid: false, message: 'Supplier harus dipilih' };
        if (!warehouse) return { isValid: false, message: 'Gudang harus dipilih' };
        if (!orderDate) return { isValid: false, message: 'Tanggal PO harus diisi' };
        if (selectedProducts.length === 0) return { isValid: false, message: 'Minimal harus ada 1 produk' };

        // Validate each product
        for (let i = 0; i < selectedProducts.length; i++) {
            const prod = selectedProducts[i];
            if (!prod.qty || prod.qty <= 0) {
                return { isValid: false, message: `Produk ${prod.nm_product} harus memiliki Qty > 0` };
            }
        }

        return { isValid: true, message: '' };
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
        clearSelection,
        clearError: () => dispatch(clearError()),
        supportData,
        getMataUangDefault,
        validateForm
    };
}
