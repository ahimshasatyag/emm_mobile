import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../stores';
import { fetchLeadsList, fetchLeadsDetail, clearDetail } from '../stores/leadsSlice';
import { useCallback, useState, useMemo } from 'react';
import { Alert } from 'react-native';
import { notificationService } from '../../../services/notification/notificationService';
import { deleteLead, updateLeadStatus } from '../api/leads.api';

export const useLeads = () => {
    const dispatch = useDispatch<AppDispatch>();
    
    const { items, currentDetail, isLoadingList, isLoadingDetail, error } = useSelector(
        (state: RootState) => state.leads
    );
    const authUser = useSelector((state: RootState) => state.auth.user);

    const [searchQuery, setSearchQuery] = useState('');

    const filteredItems = useMemo(() => {
        if (!searchQuery.trim()) return items;
        const lowerQuery = searchQuery.toLowerCase();
        return items.filter(item => 
            item.nm_customers?.toLowerCase()?.includes(lowerQuery) || 
            item.code_leads?.toLowerCase()?.includes(lowerQuery) ||
            item.status?.toLowerCase()?.includes(lowerQuery)
        );
    }, [items, searchQuery]);

    const loadList = useCallback(() => {
        dispatch(fetchLeadsList());
    }, [dispatch]);

    const loadDetail = useCallback((id: string) => {
        dispatch(fetchLeadsDetail(id));
    }, [dispatch]);

    const resetDetail = useCallback(() => {
        dispatch(clearDetail());
    }, [dispatch]);

    const handleDelete = useCallback((id: string, name: string) => {
        Alert.alert(
            'Konfirmasi Hapus',
            `Apakah Anda yakin ingin menghapus leads "${name}"?`,
            [
                { text: 'Batal', style: 'cancel' },
                {
                    text: 'Hapus',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteLead(id);
                            dispatch(fetchLeadsList());
                            await notificationService.store({
                                user_id: authUser?.id_user ?? 1,
                                id_users_level: authUser?.id_users_level ?? 1,
                                kode_trans: 'LEADS',
                                judul: 'Leads Dihapus',
                                pesan: `Leads ${name} telah dihapus oleh ${authUser?.nm_users}`,
                                action: 'Delete'
                            }).catch(() => { });
                        } catch (error) {
                            Alert.alert('Error', 'Gagal menghapus leads');
                        }
                    }
                }
            ]
        );
    }, [dispatch, authUser]);

    const handleUpdateStatus = useCallback(async (id: string, status: string, name: string) => {
        try {
            await updateLeadStatus(id, status);
            dispatch(fetchLeadsDetail(id));
            await notificationService.store({
                user_id: authUser?.id_user ?? 1,
                id_users_level: authUser?.id_users_level ?? 1,
                kode_trans: 'LEADS',
                judul: 'Status Leads Diperbarui',
                pesan: `Status Leads ${name} diubah menjadi ${status} oleh ${authUser?.nm_users}`,
                action: 'Update'
            }).catch(() => { });
            return true;
        } catch (error) {
            return false;
        }
    }, [dispatch, authUser]);

    return {
        items: filteredItems,
        currentDetail,
        isLoadingList,
        isLoadingDetail,
        error,
        searchQuery,
        setSearchQuery,
        loadList,
        loadDetail,
        resetDetail,
        deleteLead: handleDelete,
        updateStatus: handleUpdateStatus
    };
};
