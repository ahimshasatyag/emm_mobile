import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../stores';
import { fetchCstList, fetchCstDetail, closeCst, cancelCst, clearCurrentCst } from '../stores/cstSlice';
import { CstFilter } from '../types/cst.types';

export const useCst = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { cstList, currentCst, isLoading, error } = useSelector((state: RootState) => state.cst);

    const loadCstList = useCallback(() => {
        return dispatch(fetchCstList()).unwrap();
    }, [dispatch]);

    const loadCstDetail = useCallback((cst_code: string) => {
        return dispatch(fetchCstDetail(cst_code)).unwrap();
    }, [dispatch]);

    const handleCloseCst = useCallback((cst_code: string) => {
        return dispatch(closeCst(cst_code)).unwrap();
    }, [dispatch]);

    const handleCancelCst = useCallback((cst_code: string) => {
        return dispatch(cancelCst(cst_code)).unwrap();
    }, [dispatch]);

    const resetCurrentCst = useCallback(() => {
        dispatch(clearCurrentCst());
    }, [dispatch]);

    const applyFilter = useCallback((filter: CstFilter) => {
        return cstList.filter((item) => {
            const matchesSearch = item.cst_code.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
                item.nm_customers.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
                item.nm_product.toLowerCase().includes(filter.searchQuery.toLowerCase());

            if (filter.isAll) return matchesSearch;

            const matchesStatus = filter.statusFilter === '' || item.status === filter.statusFilter;
            
            let matchesDate = true;
            if (filter.startDate && item.cst_date < filter.startDate) matchesDate = false;
            if (filter.endDate && item.cst_date > filter.endDate) matchesDate = false;

            return matchesSearch && matchesStatus && matchesDate;
        });
    }, [cstList]);

    return {
        cstList,
        currentCst,
        isLoading,
        error,
        loadCstList,
        loadCstDetail,
        handleCloseCst,
        handleCancelCst,
        resetCurrentCst,
        applyFilter
    };
};
