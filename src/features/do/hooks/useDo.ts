import { useCallback } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { fetchDoList, fetchDoDetail, submitDoAction, clearDetail } from '../stores/doSlice';
import { notificationService } from '../../../services/notification/notificationService';

export const getDoStatusColor = (status: string | undefined | null) => {
    if (!status) return { bg: 'bg-gray-100 border-gray-200', text: 'text-gray-500' };
    switch (status.toUpperCase()) {
        case 'DRAFT DELIVERY ORDER': return { bg: 'bg-gray-100 border-gray-200', text: 'text-gray-700' };
        case 'WAITING AVAILABILITY': return { bg: 'bg-orange-50 border-orange-200', text: 'text-orange-600' };
        case 'READY TO DELIVER': return { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-600' };
        case 'DELIVERED': return { bg: 'bg-green-50 border-green-200', text: 'text-green-600' };
        default: return { bg: 'bg-gray-100 border-gray-200', text: 'text-gray-700' };
    }
};

export const useDo = () => {
    const dispatch = useAppDispatch();
    const { list, detail, loading, loadingDetail, error } = useAppSelector((state) => state.do);
    const authUser = useAppSelector((state) => state.auth.user);

    const getList = useCallback(() => {
        dispatch(fetchDoList());
    }, [dispatch]);

    const getDetail = useCallback((id: string) => {
        dispatch(fetchDoDetail(id));
    }, [dispatch]);

    const submitAction = useCallback(async (id: string, action: string, payload?: any) => {
        try {
            const res = await dispatch(submitDoAction({ id, action, payload })).unwrap();

            let actionText = action;
            if (action === 'UPDATE') actionText = 'Update';
            else if (action === 'SPLIT') actionText = 'Split';
            else actionText = action;

            const kode_trans = detail?.code_do || '';
            const judul = `Delivery Order ${action === 'UPDATE' ? 'Update' : action === 'SPLIT' ? 'Split' : action}`;
            const pesan = `Delivery Order ${kode_trans} telah ${actionText} oleh ${authUser?.nm_users}`;

            notificationService.store({
                user_id: authUser?.id_user ?? 1,
                id_users_level: authUser?.id_users_level ?? 1,
                kode_trans,
                judul,
                pesan,
                action
            }).catch(() => { });

            return res;
        } catch (error) {
            throw error;
        }
    }, [dispatch, detail, authUser]);

    const resetDetail = useCallback(() => {
        dispatch(clearDetail());
    }, [dispatch]);

    const validateDoAction = useCallback((actionName: string, currentDetail: any) => {
        if (!currentDetail || !currentDetail.id_do) return 'Data DO tidak valid atau belum dimuat.';

        if (actionName === 'Check Availability') {
            if (String(currentDetail.flag_payment) === '0') {
                return 'Harap selesaikan Check Payment terlebih dahulu!';
            }
        }

        return null;
    }, []);

    const validateDoSplit = useCallback((selectedIds: (string | number)[]) => {
        if (!selectedIds || selectedIds.length === 0) {
            return 'Pilih minimal 1 barang untuk di-split.';
        }
        return null;
    }, []);

    return {
        list,
        detail,
        loading,
        loadingDetail,
        error,
        getList,
        getDetail,
        submitAction,
        resetDetail,
        validateDoAction,
        validateDoSplit
    };
};
