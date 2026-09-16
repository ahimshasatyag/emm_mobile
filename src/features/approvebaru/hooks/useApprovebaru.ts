import { useCallback } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { 
    fetchPendingApprovals, 
    fetchApprovalDetail, 
    submitApproveAction, 
    submitRejectAction, 
    clearDetail 
} from '../stores/approvebaruSlice';
import { notificationService } from '../../../services/notification/notificationService';

export const useApprovebaru = () => {
    const dispatch = useAppDispatch();
    const authUser = useAppSelector((state: any) => state.auth.user);
    const { 
        approvals, 
        currentDetail, 
        loading, 
        loadingDetail, 
        error 
    } = useAppSelector((state) => state.approvebaru);

    const getApprovals = useCallback(() => {
        dispatch(fetchPendingApprovals());
    }, [dispatch]);

    const getApprovalDetail = useCallback((id: number) => {
        dispatch(fetchApprovalDetail(id));
    }, [dispatch]);

    const submitApprove = useCallback(async (id: number) => {
        const resultAction = await dispatch(submitApproveAction(id));
        if (resultAction.meta.requestStatus === 'fulfilled') {
            const item = approvals.find(a => a.id === id);
            await notificationService.store({
                user_id: authUser?.id_user ?? 1,
                id_users_level: authUser?.id_users_level ?? 1,
                kode_trans: 'APPROVE',
                judul: 'Approval Disetujui',
                pesan: `Approval dari ${item?.requester_name || 'User'} berhasil disetujui oleh ${authUser?.nm_users}`,
                action: 'Update'
            }).catch(() => {});
        }
        return resultAction;
    }, [dispatch, approvals, authUser]);

    const submitReject = useCallback(async (id: number, reason: string) => {
        const resultAction = await dispatch(submitRejectAction({ id, reason }));
        if (resultAction.meta.requestStatus === 'fulfilled') {
            const item = approvals.find(a => a.id === id);
            await notificationService.store({
                user_id: authUser?.id_user ?? 1,
                id_users_level: authUser?.id_users_level ?? 1,
                kode_trans: 'APPROVE',
                judul: 'Approval Ditolak',
                pesan: `Approval dari ${item?.requester_name || 'User'} berhasil ditolak oleh ${authUser?.nm_users}`,
                action: 'Update'
            }).catch(() => {});
        }
        return resultAction;
    }, [dispatch, approvals, authUser]);

    const resetDetail = useCallback(() => {
        dispatch(clearDetail());
    }, [dispatch]);

    const validateApproval = (id: number | undefined | null): string | null => {
        if (!id) {
            return 'ID Approval tidak valid atau kosong';
        }
        return null;
    };

    return {
        approvals,
        currentDetail,
        loading,
        loadingDetail,
        error,
        getApprovals,
        getApprovalDetail,
        submitApprove,
        submitReject,
        resetDetail,
        validateApproval
    };
};
