import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../stores';
import { fetchSalesReturs, fetchSalesReturById, clearCurrentRetur } from '../stores/salesreturSlice';
import { salesReturApi } from '../api/salesreturApi';
import { SalesRetur } from '../types/salesretur.types';
import { notificationService } from '../../../services/notification/notificationService';
import { useAppSelector } from '../../../hooks/useAppSelector';

export const useSalesRetur = () => {
    const dispatch = useDispatch<AppDispatch>();
    const authUser = useAppSelector((state) => state.auth.user);
    const { items, currentRetur, isLoading, error } = useSelector((state: RootState) => state.salesretur);

    const loadReturs = useCallback((search?: string) => {
        dispatch(fetchSalesReturs(search));
    }, [dispatch]);

    const loadReturById = useCallback((id: string) => {
        dispatch(fetchSalesReturById(id));
    }, [dispatch]);

    const clearRetur = useCallback(() => {
        dispatch(clearCurrentRetur());
    }, [dispatch]);

    const getCustomers = useCallback(async () => {
        const response = await salesReturApi.getCustomers();
        return response.data;
    }, []);

    const getDOByCustomer = useCallback(async (id_customer: string) => {
        const response = await salesReturApi.getDOByCustomer(id_customer);
        return response.data;
    }, []);

    const getDODetails = useCallback(async (id_do: string) => {
        const response = await salesReturApi.getDODetails(id_do);
        return response.data;
    }, []);

    const formatPayload = (data: Partial<SalesRetur>) => {
        const payload: any = {
            id_customers: data.id_customers,
            id_do: data.id_do,
            date: data.date,
            keterangan: data.keterangan,
        };
        
        if (data.items && data.items.length > 0) {
            payload.total_product = data.items.length;
            data.items.forEach((item, index) => {
                const i = index + 1;
                payload[`ceklis_${i}`] = 1;
                payload[`id_product_${i}`] = item.id_product;
                payload[`id_product_sn_${i}`] = item.id_product_sn;
                payload[`nbarcode_${i}`] = item.nbarcode;
            });
        }
        return payload;
    };

    const createRetur = useCallback(async (data: Partial<SalesRetur>) => {
        const result = await salesReturApi.createSalesRetur(formatPayload(data));
        if (result && result.status) {
            await notificationService.store({
                user_id: authUser?.id_user ?? 1,
                id_users_level: authUser?.id_users_level ?? 1,
                kode_trans: 'SALES RETUR',
                judul: 'Sales Retur Baru',
                pesan: `Sales Retur berhasil ditambahkan oleh ${authUser?.nm_users || 'User'}`,
                action: 'Create'
            }).catch(() => {});
        }
        return result;
    }, [authUser]);

    const updateRetur = useCallback(async (id: string, data: Partial<SalesRetur>) => {
        const result = await salesReturApi.updateSalesRetur(id, formatPayload(data));
        if (result && result.status) {
            await notificationService.store({
                user_id: authUser?.id_user ?? 1,
                id_users_level: authUser?.id_users_level ?? 1,
                kode_trans: 'SALES RETUR',
                judul: 'Sales Retur Diperbarui',
                pesan: `Sales Retur berhasil diperbarui oleh ${authUser?.nm_users || 'User'}`,
                action: 'Update'
            }).catch(() => {});
        }
        return result;
    }, [authUser]);

    const confirmRetur = useCallback(async (id: string) => {
        const result = await salesReturApi.confirmSalesRetur(id);
        if (result && result.status) {
            await notificationService.store({
                user_id: authUser?.id_user ?? 1,
                id_users_level: authUser?.id_users_level ?? 1,
                kode_trans: 'SALES RETUR',
                judul: 'Sales Retur Confirmed',
                pesan: `Sales Retur berhasil disetujui oleh ${authUser?.nm_users || 'User'}`,
                action: 'Update'
            }).catch(() => {});
        }
        return result;
    }, [authUser]);

    const cancelRetur = useCallback(async (id: string) => {
        const result = await salesReturApi.cancelSalesRetur(id);
        if (result && result.status) {
            await notificationService.store({
                user_id: authUser?.id_user ?? 1,
                id_users_level: authUser?.id_users_level ?? 1,
                kode_trans: 'SALES RETUR',
                judul: 'Sales Retur Dibatalkan',
                pesan: `Sales Retur dibatalkan oleh ${authUser?.nm_users || 'User'}`,
                action: 'Update'
            }).catch(() => {});
        }
        return result;
    }, [authUser]);

    const validateForm = useCallback((id_customers: string, id_do: string, activeItems: any[]): string | null => {
        const isAllEmpty = !id_customers && !id_do;

        if (isAllEmpty) return "Semua field harus diisi!";
        if (!id_customers) return "Pilih Customer terlebih dahulu";
        if (!id_do) return "Pilih DO terlebih dahulu";
        if (!activeItems || activeItems.length === 0) return "Pilih minimal 1 barang untuk diretur";

        return null;
    }, []);

    return {
        items,
        currentRetur,
        isLoading,
        error,
        loadReturs,
        loadReturById,
        clearRetur,
        getCustomers,
        getDOByCustomer,
        getDODetails,
        createRetur,
        updateRetur,
        confirmRetur,
        cancelRetur,
        validateForm
    };
};
