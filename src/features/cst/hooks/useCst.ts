import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../stores';
import { fetchCstList, fetchCstDetail, closeCst, cancelCst, clearCurrentCst } from '../stores/cstSlice';
import { fetchNotifications } from '../../../stores/notificationSlice';
import { notificationService } from '../../../services/notification/notificationService';
import { CstFilter } from '../types/cst.types';

export const useCst = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { cstList, currentCst, isLoading, error } = useSelector((state: RootState) => state.cst);
    const authUser = useSelector((state: RootState) => state.auth.user);

    const loadCstList = useCallback(() => {
        return dispatch(fetchCstList()).unwrap();
    }, [dispatch]);

    const loadCstDetail = useCallback((cst_code: string) => {
        return dispatch(fetchCstDetail(cst_code)).unwrap();
    }, [dispatch]);

    const handleCloseCst = useCallback(async (cst_code: string) => {
        const cst_by = authUser?.nm_users || 'Admin';
        const result = await dispatch(closeCst({ cst_code, cst_by })).unwrap();
        if (authUser?.id_user) {
            const cstNumber = cst_code.split('/').pop() || cst_code;
            await notificationService.store({
                user_id: authUser.id_user,
                id_users_level: authUser.id_users_level ?? 1,
                kode_trans: cst_code,
                judul: 'CST Selesai',
                pesan: `CST #${cstNumber} telah selesai (DONE) oleh ${authUser.nm_users}`,
                action: 'Update'
            }).catch(() => { });
            dispatch(fetchNotifications(authUser.id_user));
        }
        return result;
    }, [dispatch, authUser]);

    const handleCancelCst = useCallback(async (cst_code: string) => {
        const cst_by = authUser?.nm_users || 'Admin';
        const result = await dispatch(cancelCst({ cst_code, cst_by })).unwrap();
        if (authUser?.id_user) {
            const cstNumber = cst_code.split('/').pop() || cst_code;
            await notificationService.store({
                user_id: authUser.id_user,
                id_users_level: authUser.id_users_level ?? 1,
                kode_trans: cst_code,
                judul: 'CST Dibatalkan',
                pesan: `CST #${cstNumber} telah dibatalkan oleh ${authUser.nm_users}`,
                action: 'Delete'
            }).catch(() => { });
            dispatch(fetchNotifications(authUser.id_user));
        }
        return result;
    }, [dispatch, authUser]);

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
