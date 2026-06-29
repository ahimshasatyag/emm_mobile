import { useEffect, useCallback } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { fetchEmployees, setSearchQuery } from '../stores/employeeSlice';

export function useEmployee() {
    const dispatch = useAppDispatch();
    const { filteredData, isLoading, error, searchQuery } = useAppSelector(
        (state) => state.employee
    );

    const loadData = useCallback(() => {
        dispatch(fetchEmployees());
    }, [dispatch]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleSearch = (query: string) => {
        dispatch(setSearchQuery(query));
    };

    return {
        data: filteredData,
        isLoading,
        error,
        searchQuery,
        setSearchQuery: handleSearch,
        loadData,
    };
}
