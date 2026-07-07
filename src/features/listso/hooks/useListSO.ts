import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../stores';
import { fetchSOList, fetchSODetail, setFilters, clearDetail } from '../stores/listsoSlice';
import { ListSOFilter } from '../types/listso.types';
import { useCallback } from 'react';

export const useListSO = () => {
    const dispatch = useDispatch<AppDispatch>();
    
    const { items, currentDetail, filters, isLoadingList, isLoadingDetail, error } = useSelector(
        (state: RootState) => state.listso
    );

    const loadList = useCallback(() => {
        dispatch(fetchSOList(filters));
    }, [dispatch, filters]);

    const loadDetail = useCallback((id: string) => {
        dispatch(fetchSODetail(id));
    }, [dispatch]);

    const updateFilters = useCallback((newFilters: Partial<ListSOFilter>) => {
        dispatch(setFilters(newFilters));
    }, [dispatch]);

    const resetDetail = useCallback(() => {
        dispatch(clearDetail());
    }, [dispatch]);

    return {
        items,
        currentDetail,
        filters,
        isLoadingList,
        isLoadingDetail,
        error,
        loadList,
        loadDetail,
        updateFilters,
        resetDetail
    };
};
