import { useEffect } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { fetchCountersApi } from '../api/counter.api';
import { setData, setLoading, setError } from '../stores/counterSlice';

export function useCounter() {
    const dispatch = useAppDispatch();
    const { data, isLoading, error } = useAppSelector((state) => state.counter);

    useEffect(() => {
        const loadData = async () => {
            if (data.length > 0) return;

            dispatch(setLoading(true));
            try {
                const result = await fetchCountersApi();
                dispatch(setData(result));
            } catch (err: any) {
                dispatch(setError(err.message || 'Terjadi kesalahan saat memuat data counter'));
            }
        };

        loadData();
    }, [dispatch]);

    return { data, isLoading, error };
}
