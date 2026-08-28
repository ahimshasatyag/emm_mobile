import { useEffect, useCallback } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { fetchEmployees, setSearchQuery, deleteEmployee } from '../stores/employeeSlice';
import { Alert } from 'react-native';
import { notificationService } from '../../../services/notification/notificationService';

export function useEmployee() {
    const dispatch = useAppDispatch();
    const { filteredData, isLoading, error, searchQuery } = useAppSelector(
        (state) => state.employee
    );
    const authUser = useAppSelector((state) => state.auth.user);

    const loadData = useCallback(() => {
        dispatch(fetchEmployees());
    }, [dispatch]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleSearch = (query: string) => {
        dispatch(setSearchQuery(query));
    };

    const handleDelete = (id: string, name: string) => {
        Alert.alert(
            'Konfirmasi Hapus',
            `Apakah Anda yakin ingin menghapus karyawan "${name}"?`,
            [
                { text: 'Batal', style: 'cancel' },
                {
                    text: 'Hapus',
                    style: 'destructive',
                    onPress: async () => {
                        await dispatch(deleteEmployee(id));
                        await notificationService.store({
                            user_id: authUser?.id_user ?? 1,
                            id_users_level: authUser?.id_users_level ?? 1,
                            kode_trans: 'EMPLOYEE',
                            judul: 'Data Karyawan Dihapus',
                            pesan: `Data karyawan ${name} telah dihapus oleh ${authUser?.nm_users}`,
                            action: 'Delete'
                        }).catch(() => { });
                    }
                }
            ]
        );
    };

    return {
        data: filteredData,
        isLoading,
        error,
        searchQuery,
        setSearchQuery: handleSearch,
        loadData,
        handleDelete
    };
}
