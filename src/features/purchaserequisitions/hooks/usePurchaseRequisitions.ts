import { useCallback, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../stores';
import { fetchPRList, fetchPRDetail, createPR, updatePR, ajukanPR, clearCurrentDetail, clearError } from '../stores/purchaserequisitionsSlice';
import { PurchaseRequisition } from '../types/purchaserequisitions';
import { purchaseRequisitionsApi } from '../api';
import { notificationService } from '../../../services/notification/notificationService';

export const usePurchaseRequisitions = () => {
    const dispatch = useDispatch<AppDispatch>();
    
    const { items, currentDetail, isLoadingList, isLoadingDetail, isSaving, error } = useSelector(
        (state: RootState) => state.purchaserequisitions
    );
    const authUser = useSelector((state: RootState) => state.auth.user);

    const [searchQuery, setSearchQuery] = useState('');

    const filteredItems = useMemo(() => {
        if (!searchQuery.trim()) return items;
        const lowerQuery = searchQuery.toLowerCase();
        return items.filter(item => 
            item.code_pr?.toLowerCase()?.includes(lowerQuery) || 
            item.username?.toLowerCase()?.includes(lowerQuery) ||
            item.status_pr?.toLowerCase()?.includes(lowerQuery)
        );
    }, [items, searchQuery]);

    const loadList = useCallback(() => {
        dispatch(fetchPRList());
    }, [dispatch]);

    const loadDetail = useCallback((id: string) => {
        dispatch(fetchPRDetail(id));
    }, [dispatch]);

    const create = useCallback(async (data: Partial<PurchaseRequisition>) => {
        const result = await dispatch(createPR(data)).unwrap();
        
        await notificationService.store({
            user_id: authUser?.id_user ?? 1,
            id_users_level: authUser?.id_users_level ?? 1,
            kode_trans: 'PR BARU',
            judul: 'Purchase Requisition Baru',
            pesan: `Purchase Requisition baru berhasil dibuat oleh ${authUser?.nm_users}`,
            action: 'Create'
        }).catch(() => { });
        
        return result;
    }, [dispatch, authUser]);

    const update = useCallback(async (id_pr: string, data: Partial<PurchaseRequisition>) => {
        const result = await dispatch(updatePR({ id_pr, data })).unwrap();
        
        await notificationService.store({
            user_id: authUser?.id_user ?? 1,
            id_users_level: authUser?.id_users_level ?? 1,
            kode_trans: data.code_pr || id_pr || 'PR',
            judul: 'Purchase Requisition Diperbarui',
            pesan: `Purchase Requisition ${data.code_pr || id_pr} berhasil diperbarui oleh ${authUser?.nm_users}`,
            action: 'Update'
        }).catch(() => { });
        
        return result;
    }, [dispatch, authUser]);

    const ajukan = useCallback(async (id_pr: string, code_pr?: string) => {
        const result = await dispatch(ajukanPR(id_pr)).unwrap();
        
        await notificationService.store({
            user_id: authUser?.id_user ?? 1,
            id_users_level: authUser?.id_users_level ?? 1,
            kode_trans: code_pr || id_pr || 'PR',
            judul: 'Purchase Requisition Diajukan',
            pesan: `Purchase Requisition ${code_pr || id_pr} telah diajukan oleh ${authUser?.nm_users}`,
            action: 'Approve'
        }).catch(() => { });
        
        return result;
    }, [dispatch, authUser]);

    const resetDetail = useCallback(() => {
        dispatch(clearCurrentDetail());
    }, [dispatch]);

    // New API integrations directly via hook
    const supportData = useCallback(async () => {
        return await purchaseRequisitionsApi.supportData();
    }, []);

    const detailBarang = useCallback(async (id_product: string) => {
        return await purchaseRequisitionsApi.detailBarang(id_product);
    }, []);

    const listPr = useCallback(async () => {
        return await purchaseRequisitionsApi.listPr();
    }, []);

    const simpanPo = useCallback(async (data_id_pr_dtl: any[]) => {
        return await purchaseRequisitionsApi.simpanPo(data_id_pr_dtl);
    }, []);

    return {
        items: filteredItems,
        currentDetail,
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
        ajukan,
        resetDetail,
        supportData,
        detailBarang,
        listPr,
        simpanPo,
        clearError: () => dispatch(clearError())
    };
};

export const validateForm = (formData: any, details: any[]): string | null => {
    if (!formData.username?.trim()) return 'Responsible wajib diisi';
    if (details.length === 0) return 'Daftar barang tidak boleh kosong';
    return null;
};

export const validateProductForm = (productData: any): string | null => {
    if (!productData.id_product) return 'Silakan pilih barang terlebih dahulu';
    return null;
};

export const validateCreateQuotation = (selectedItems: any[]): string | null => {
    if (!selectedItems || selectedItems.length === 0) return 'Pilih PR Minimal 1';
    return null;
};
