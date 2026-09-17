import { useEffect } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { setData, setLoading, setError } from '../stores/employeedivisiSlice';
import { fetchEmployeeDivisiApi } from '../api/employeedivisi.api';

export function useEmployeeDivisi() {
    const dispatch = useAppDispatch();
    const { data, isLoading, error } = useAppSelector((state) => state.employeedivisi);

    useEffect(() => {
        if (data.length === 0) {
            loadDivisions();
        }
    }, []);

    const loadDivisions = async () => {
        dispatch(setLoading(true));
        try {
            const result = await fetchEmployeeDivisiApi();
            dispatch(setData(result));
        } catch (err: any) {
            dispatch(setError(err.message || 'Terjadi kesalahan'));
        }
    };

    return {
        data,
        isLoading,
        error,
        loadDivisions,
    };
}
