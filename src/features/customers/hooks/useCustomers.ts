import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../stores';
import { fetchCustomers, deleteCustomer, setSearchQuery } from '../stores/customersSlice';

export function useCustomers() {
    const dispatch = useDispatch<AppDispatch>();
    const { data, filteredData, isLoading, error, searchQuery } = useSelector(
        (state: RootState) => state.customers
    );

    const handleFetchCustomers = () => {
        dispatch(fetchCustomers());
    };

    const handleSearch = (query: string) => {
        dispatch(setSearchQuery(query));
    };

    const handleDelete = async (id: string) => {
        await dispatch(deleteCustomer(id));
        // You might want to refresh or rely on state update
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
