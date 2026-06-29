import { useEffect } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { setData, setLoading, setError } from '../stores/inventorycategorySlice';
import { fetchInventoryCategoryApi } from '../api/inventorycategory.api';

export function useInventoryCategory() {
    const dispatch = useAppDispatch();
    const { data, isLoading, error } = useAppSelector((state) => state.inventorycategory);

    useEffect(() => {
        if (data.length === 0) {
            loadCategories();
        }
    }, []);

    const loadCategories = async () => {
        dispatch(setLoading(true));
        try {
            const result = await fetchInventoryCategoryApi();
            dispatch(setData(result));
        } catch (err: any) {
            dispatch(setError(err.message || 'Terjadi kesalahan'));
        }
    };

    return {
        data,
        isLoading,
        error,
        loadCategories,
    };
}
