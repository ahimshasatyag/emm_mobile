import { useEffect, useCallback } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { fetchEmployeePosisis, deleteEmployeePosisi, setSearchQuery } from '../stores/employeeposisiSlice';

export const useEmployeePosisi = () => {
    const dispatch = useAppDispatch();
    const { data, filteredData, isLoading, error, searchQuery } = useAppSelector((state) => state.employeeposisi);

    useEffect(() => {
        dispatch(fetchEmployeePosisis());
    }, [dispatch]);

    const handleSearch = useCallback((text: string) => {
        dispatch(setSearchQuery(text));
    }, [dispatch]);

    const handleDelete = useCallback(async (id: number) => {
        try {
            await dispatch(deleteEmployeePosisi(id)).unwrap();
            return true;
        } catch (error) {
            console.error('Failed to delete employee posisi:', error);
            return false;
        }
    }, [dispatch]);

    const refetch = useCallback(() => {
        dispatch(fetchEmployeePosisis());
    }, [dispatch]);

    return {
        posisis: filteredData,
        isLoading,
        error,
        searchQuery,
        handleSearch,
        handleDelete,
        refetch,
    };
};
