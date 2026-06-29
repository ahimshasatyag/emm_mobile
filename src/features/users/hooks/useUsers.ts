import { useEffect } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { fetchUsersApi } from '../api/users.api';
import { setData, setLoading, setError } from '../store/usersSlice';

export function useUsers() {
    const dispatch = useAppDispatch();
    const { data, isLoading, error } = useAppSelector((state) => state.users);

    useEffect(() => {
        let mounted = true;

        const loadData = async () => {
            if (data.length > 0) return; // Only fetch if empty

            dispatch(setLoading(true));
            try {
                const result = await fetchUsersApi();
                dispatch(setData(result));
            } catch (err: any) {
                dispatch(setError(err.message || 'Terjadi kesalahan saat memuat data pengguna'));
            }
        };

        loadData();

        return () => {
            mounted = false;
        };
    }, [dispatch]);

    return { data, isLoading, error };
}
