import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../stores';
import { fetchSalesReturs, fetchSalesReturById, clearCurrentRetur } from '../stores/salesreturSlice';
import { salesReturApi } from '../api/salesreturApi';
import { SalesRetur } from '../types/salesretur.types';

export const useSalesRetur = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items, currentRetur, isLoading, error } = useSelector((state: RootState) => state.salesretur);

    const loadReturs = useCallback(() => {
        dispatch(fetchSalesReturs());
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

    const createRetur = useCallback(async (data: Partial<SalesRetur>) => {
        const result = await salesReturApi.createSalesRetur(data);
        return result;
    }, []);

    const updateRetur = useCallback(async (id: string, data: Partial<SalesRetur>) => {
        const result = await salesReturApi.updateSalesRetur(id, data);
        return result;
    }, []);

    const confirmRetur = useCallback(async (id: string) => {
        const result = await salesReturApi.confirmSalesRetur(id);
        return result;
    }, []);

    const cancelRetur = useCallback(async (id: string) => {
        const result = await salesReturApi.cancelSalesRetur(id);
        return result;
    }, []);

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
