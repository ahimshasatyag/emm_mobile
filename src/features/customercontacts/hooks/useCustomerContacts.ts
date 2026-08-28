import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../stores';
import { fetchCustomerContacts, deleteCustomerContact, setSearchQuery } from '../stores/customerContactsSlice';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { Alert } from 'react-native';
import { notificationService } from '../../../services/notification/notificationService';

export function useCustomerContacts() {
    const dispatch = useAppDispatch();
    const { data, filteredData, isLoading, error, searchQuery } = useAppSelector(
        (state) => state.customerContacts
    );
    const authUser = useAppSelector((state) => state.auth.user);

    const handleFetch = () => {
        dispatch(fetchCustomerContacts());
    };

    const handleSearch = (query: string) => {
        dispatch(setSearchQuery(query));
    };

    const handleDelete = (id: string, name: string) => {
        Alert.alert(
            'Konfirmasi Hapus',
            `Apakah Anda yakin ingin menghapus kontak "${name}"?`,
            [
                { text: 'Batal', style: 'cancel' },
                {
                    text: 'Hapus',
                    style: 'destructive',
                    onPress: async () => {
                        await dispatch(deleteCustomerContact(id));
                        await notificationService.store({
                            user_id: authUser?.id_user ?? 1,
                            id_users_level: authUser?.id_users_level ?? 1,
                            kode_trans: 'CUSTOMER_CONTACT',
                            judul: 'Kontak Pelanggan Dihapus',
                            pesan: `Kontak ${name} telah dihapus oleh ${authUser?.nm_users}`,
                            action: 'Delete'
                        }).catch(() => { });
                    }
                }
            ]
        );
    };

    return {
        customerContacts: filteredData,
        allCustomerContacts: data,
        isLoading,
        error,
        searchQuery,
        fetchCustomerContacts: handleFetch,
        setSearchQuery: handleSearch,
        deleteCustomerContact: handleDelete,
    };
}
