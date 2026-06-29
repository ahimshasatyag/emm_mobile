import { useEffect } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { fetchUsersLevelApi } from '../api/userslevel.api';
import { setData, setLoading, setError } from '../stores/userslevelSlice';

export function useUsersLevel() {
    const dispatch = useAppDispatch();
    const { data, isLoading, error } = useAppSelector((state) => state.userslevel);

    useEffect(() => {
        const loadData = async () => {
            if (data.length > 0) return;

            dispatch(setLoading(true));
            try {
                const result = await fetchUsersLevelApi();
                dispatch(setData(result));
            } catch (err: any) {
                dispatch(setError(err.message || 'Terjadi kesalahan saat memuat data users level'));
            }
        };

        loadData();
    }, [dispatch]);

    return { data, isLoading, error };
}
