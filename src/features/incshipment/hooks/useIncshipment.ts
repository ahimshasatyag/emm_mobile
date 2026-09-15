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
import { notificationService } from '../../../services/notification/notificationService';

export function useIncshipment() {
    const dispatch = useDispatch<AppDispatch>();
    const { items, selectedItem, isLoadingList, isLoadingDetail, isSaving, error } = useSelector((state: RootState) => state.incshipment);
    const authUser = useSelector((state: RootState) => state.auth.user);
    const [searchQuery, setSearchQuery] = useState('');

    const loadList = useCallback(async () => {
        return await dispatch(fetchIncshipments(searchQuery)).unwrap();
    }, [dispatch, searchQuery]);

    const loadDetail = useCallback(async (id: string) => {
        return await dispatch(fetchIncshipmentDetail(id)).unwrap();
    }, [dispatch]);

    const handleAssignSN = useCallback(async (id: string) => {
        const result = await dispatch(assignSerialNumber(id)).unwrap();
        await notificationService.store({
            user_id: authUser?.id_user ?? 1,
            id_users_level: authUser?.id_users_level ?? 1,
            kode_trans: id || 'INCOMING_SHIPMENT',
            judul: 'Assign Serial Number',
            pesan: `Serial Number berhasil di-assign pada Incoming Shipment ${id} oleh ${authUser?.nm_users}`,
            action: 'Update'
        }).catch(() => { });
        return result;
    }, [dispatch, authUser]);

    const handlePrintBarcode = useCallback(async (id: string) => {
        const result = await dispatch(printBarcode(id)).unwrap();
        await notificationService.store({
            user_id: authUser?.id_user ?? 1,
            id_users_level: authUser?.id_users_level ?? 1,
            kode_trans: id || 'INCOMING_SHIPMENT',
            judul: 'Print Barcode',
            pesan: `Barcode berhasil di-print pada Incoming Shipment ${id} oleh ${authUser?.nm_users}`,
            action: 'Update'
        }).catch(() => { });
        return result;
    }, [dispatch, authUser]);

    const handleReceiveGoods = useCallback(async (id: string, data_barang: any[]) => {
        const result = await dispatch(receiveGoods({ id, data_barang })).unwrap();
        await notificationService.store({
            user_id: authUser?.id_user ?? 1,
            id_users_level: authUser?.id_users_level ?? 1,
            kode_trans: id || 'INCOMING_SHIPMENT',
            judul: 'Receive Goods',
            pesan: `Barang berhasil di-receive pada Incoming Shipment ${id} oleh ${authUser?.nm_users}`,
            action: 'Update'
        }).catch(() => { });
        return result;
    }, [dispatch, authUser]);

    const clearSelection = useCallback(() => {
        dispatch(clearSelectedIncshipment());
    }, [dispatch]);

    const validateReceive = (data_barang: any[]): string | null => {
        if (data_barang.length === 0) {
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
