import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../stores';
import { fetchCustomerContacts, deleteCustomerContact, setSearchQuery } from '../stores/customerContactsSlice';

export function useCustomerContacts() {
    const dispatch = useDispatch<AppDispatch>();
    const { data, filteredData, isLoading, error, searchQuery } = useSelector(
        (state: RootState) => state.customerContacts
    );

    const handleFetch = () => {
        dispatch(fetchCustomerContacts());
    };

    const handleSearch = (query: string) => {
        dispatch(setSearchQuery(query));
    };

    const handleDelete = async (id: string) => {
        await dispatch(deleteCustomerContact(id));
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
