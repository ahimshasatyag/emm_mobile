import { useEffect } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { setData, setLoading, setError } from '../stores/inventorytypeSlice';
import { fetchInventoryTypeApi } from '../api/inventorytype.api';

export function useInventoryType() {
    const dispatch = useAppDispatch();
    const { data, isLoading, error } = useAppSelector((state) => state.inventorytype);

    useEffect(() => {
        if (data.length === 0) {
            loadTypes();
        }
    }, []);

    const loadTypes = async () => {
        dispatch(setLoading(true));
        try {
            const result = await fetchInventoryTypeApi();
            dispatch(setData(result));
        } catch (err: any) {
            dispatch(setError(err.message || 'Terjadi kesalahan'));
        }
    };

    return {
        data,
        isLoading,
        error,
        loadTypes,
    };
}
