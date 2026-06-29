import { useEffect } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { fetchUsersLogApi } from '../api/userslog.api';
import { setData, setLoading, setError } from '../stores/userslogSlice';

export function useUsersLog() {
    const dispatch = useAppDispatch();
    const { data, isLoading, error } = useAppSelector((state) => state.userslog);

    useEffect(() => {
        const loadData = async () => {
            if (data.length > 0) return; // Only fetch if empty

            dispatch(setLoading(true));
            try {
                const result = await fetchUsersLogApi();
                dispatch(setData(result));
            } catch (err: any) {
                dispatch(setError(err.message || 'Terjadi kesalahan saat memuat data log pengguna'));
            }
        };

        loadData();
    }, [dispatch]);

    return { data, isLoading, error };
}
