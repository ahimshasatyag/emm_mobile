import { useEffect } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { fetchUsersApi, fetchUserLevelsApi } from '../api/users.api';
import { setData, setLevels, setLoading, setError } from '../store/usersSlice';

export function useUsers() {
    const dispatch = useAppDispatch();
    const { data, levels, isLoading, error } = useAppSelector((state) => state.users);

    useEffect(() => {
        let mounted = true;

        const loadData = async () => {
            if (data.length > 0 && levels.length > 0) return; 

            dispatch(setLoading(true));
            try {
                const [usersResult, levelsResult] = await Promise.all([
                    fetchUsersApi(),
                    fetchUserLevelsApi()
                ]);
                dispatch(setData(usersResult));
                dispatch(setLevels(levelsResult));
            } catch (err: any) {
                dispatch(setError(err.message || 'Terjadi kesalahan saat memuat data pengguna'));
            }
        };

        loadData();

        return () => {
            mounted = false;
        };
    }, [dispatch]);

    return { data, levels, isLoading, error };
}
