import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../stores';
import { lktApi } from '../api/lkt.api';
import { setLoading, setError, setItems, setCurrentLkt, setFilter } from '../stores/lktSlice';
import { LktFilter } from '../types/lkt.types';

export const useLkt = () => {
    const dispatch = useDispatch();
    const { items, currentLkt, isLoading, error, filter } = useSelector((state: RootState) => state.lkt);

    const loadLkts = useCallback(async (currentFilter: LktFilter) => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const data = await lktApi.getLkts(currentFilter);
            dispatch(setItems(data));
        } catch (err: any) {
            dispatch(setError(err.message || 'Failed to fetch LKTs'));
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const loadLktDetail = useCallback(async (id: string) => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const data = await lktApi.getLktById(id);
            dispatch(setCurrentLkt(data || null));
        } catch (err: any) {
            dispatch(setError(err.message || 'Failed to fetch LKT detail'));
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleCloseLkt = async (id: string) => {
        dispatch(setLoading(true));
        try {
            const success = await lktApi.closeLkt(id);
            if (success) {
                // Refresh list if needed or update current
                await loadLktDetail(id);
            }
            return success;
        } catch (err: any) {
            dispatch(setError(err.message || 'Failed to close LKT'));
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleCancelLkt = async (id: string) => {
        dispatch(setLoading(true));
        try {
            const success = await lktApi.cancelLkt(id);
            if (success) {
                await loadLktDetail(id);
            }
            return success;
        } catch (err: any) {
            dispatch(setError(err.message || 'Failed to cancel LKT'));
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const updateFilter = useCallback((newFilter: Partial<LktFilter>) => {
        dispatch(setFilter(newFilter));
    }, [dispatch]);

    const resetCurrentLkt = useCallback(() => {
        dispatch(setCurrentLkt(null));
    }, [dispatch]);

    return {
        items,
        currentLkt,
        isLoading,
        error,
        filter,
        loadLkts,
        loadLktDetail,
        handleCloseLkt,
        handleCancelLkt,
        updateFilter,
        resetCurrentLkt
    };
};
