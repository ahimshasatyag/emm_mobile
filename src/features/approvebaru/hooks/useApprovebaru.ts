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

export const useApprovebaru = () => {
    const dispatch = useAppDispatch();
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
        return resultAction;
    }, [dispatch]);

    const submitReject = useCallback(async (id: number, reason: string) => {
        const resultAction = await dispatch(submitRejectAction({ id, reason }));
        return resultAction;
    }, [dispatch]);

    const resetDetail = useCallback(() => {
        dispatch(clearDetail());
    }, [dispatch]);

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
        resetDetail
    };
};
