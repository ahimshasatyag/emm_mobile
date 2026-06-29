import { useEffect } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { fetchHomeDataApi } from '../api/home.api';
import { setData, setLoading, setError } from '../store/homeSlice';

export const useHomeData = () => {
    const dispatch = useAppDispatch();
    const { data, isLoading, error } = useAppSelector((state) => state.home);

    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            if (!isMounted) return;
            dispatch(setLoading(true));
            try {
                const result = await fetchHomeDataApi();
                if (isMounted) {
                    dispatch(setData(result));
                }
            } catch (err: any) {
                if (isMounted) {
                    dispatch(setError(err.message || 'Gagal memuat data dashboard'));
                }
            }
        };

        loadData();

        return () => {
            isMounted = false;
        };
    }, [dispatch]);

    return { data, isLoading, error };
};
