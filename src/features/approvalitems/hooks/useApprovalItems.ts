import { useEffect } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { setData, setLoading, setError } from '../stores/approvalitemsSlice';
import { fetchApprovalItemsApi } from '../api/approvalitems.api';

export function useApprovalItems() {
    const dispatch = useAppDispatch();
    const { data, isLoading, error } = useAppSelector((state) => state.approvalitems);

    useEffect(() => {
        if (data.length === 0) {
            loadItems();
        }
    }, []);

    const loadItems = async () => {
        dispatch(setLoading(true));
        try {
            const result = await fetchApprovalItemsApi();
            dispatch(setData(result));
        } catch (err: any) {
            dispatch(setError(err.message || 'Terjadi kesalahan'));
        }
    };

    return {
        data,
        isLoading,
        error,
        loadItems,
    };
}
