import { fetchCustomers, deleteCustomer, setSearchQuery } from '../stores/customersSlice';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { Alert } from 'react-native';
import { notificationService } from '../../../services/notification/notificationService';

export function useCustomers() {
    const dispatch = useAppDispatch();
    const { data, filteredData, isLoading, error, searchQuery } = useAppSelector(
        (state) => state.customers
    );
    const authUser = useAppSelector((state) => state.auth.user);

    const handleFetchCustomers = () => {
        dispatch(fetchCustomers());
    };

    const handleSearch = (query: string) => {
        dispatch(setSearchQuery(query));
    };

    const handleDelete = (id: string, name: string) => {
        Alert.alert(
            'Konfirmasi Hapus',
            `Apakah Anda yakin ingin menghapus pelanggan "${name}"?`,
            [
                { text: 'Batal', style: 'cancel' },
                {
                    text: 'Hapus',
                    style: 'destructive',
                    onPress: async () => {
                        await dispatch(deleteCustomer(id));
                        await notificationService.store({
                            user_id: authUser?.id_user ?? 1,
                            id_users_level: authUser?.id_users_level ?? 1,
                            kode_trans: 'CUSTOMER',
                            judul: 'Customer Dihapus',
                            pesan: `Customer ${name} telah dihapus oleh ${authUser?.nm_users}`,
                            action: 'Delete'
                        }).catch(() => { });
                    }
                }
            ]
        );
    };

    return {
        customers: filteredData,
        allCustomers: data,
        isLoading,
        error,
        searchQuery,
        fetchCustomers: handleFetchCustomers,
        setSearchQuery: handleSearch,
        deleteCustomer: handleDelete,
    };
}
