import { useEffect, useState, useMemo } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { fetchApprovalSchemes, deleteApprovalScheme } from '../stores/approvalschemeSlice';
import { Alert } from 'react-native';
import { notificationService } from '../../../services/notification/notificationService';

export function useApprovalScheme() {
    const dispatch = useAppDispatch();
    const { data, loading, error } = useAppSelector((state) => state.approvalscheme);
    const authUser = useAppSelector((state) => state.auth.user);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        dispatch(fetchApprovalSchemes());
    }, [dispatch]);

    const loadData = () => {
        dispatch(fetchApprovalSchemes());
    };

    const handleDelete = (id: string, name: string) => {
        Alert.alert(
            'Konfirmasi Hapus',
            `Apakah Anda yakin ingin menghapus skema approval "${name}"?`,
            [
                { text: 'Batal', style: 'cancel' },
                {
                    text: 'Hapus',
                    style: 'destructive',
                    onPress: async () => {
                        await dispatch(deleteApprovalScheme(id));
                        await notificationService.store({
                            user_id: authUser?.id_user ?? 1,
                            id_users_level: authUser?.id_users_level ?? 1,
                            kode_trans: 'APPROVAL SCHEME',
                            judul: 'Skema Approval Dihapus',
                            pesan: `Skema ${name} telah dihapus oleh ${authUser?.nm_users}`,
                            action: 'Delete'
                        }).catch(() => { });
                    }
                }
            ]
        );
    };

    const filteredData = useMemo(() => {
        if (!searchQuery) return data;
        const lowerQ = searchQuery.toLowerCase();
        return data.filter(item => 
            item.scheme_name.toLowerCase().includes(lowerQ) || 
            item.description.toLowerCase().includes(lowerQ)
        );
    }, [data, searchQuery]);

    return {
        data: filteredData,
        isLoading: loading,
        error,
        searchQuery,
        setSearchQuery,
        loadData,
        handleDelete
    };
}
