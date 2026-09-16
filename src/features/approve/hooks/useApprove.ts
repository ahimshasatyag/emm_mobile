import { useCallback } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { 
    fetchApprovals, 
    submitApprovalAction 
} from '../stores/approveSlice';

export const useApprove = () => {
    const dispatch = useAppDispatch();
    const { quotations, accounting, history, loading, error } = useAppSelector((state) => state.approve);

    const getApprovals = useCallback((search?: string) => {
        dispatch(fetchApprovals(search));
    }, [dispatch]);

    const submitApproval = useCallback(async (id_approval: string, action: string, status: string) => {
        const resultAction = await dispatch(submitApprovalAction({ id_approval, action, status }));
        return resultAction;
    }, [dispatch]);

    const validateApproval = (actionCode: string | undefined | null): string | null => {
        if (!actionCode || actionCode.trim() === '') {
            return 'Kode aksi tidak valid atau kosong';
        }
        return null;
    };

    return {
        quotations,
        accounting,
        history,
        loading,
        error,
        getApprovals,
        submitApproval,
        validateApproval
    };
};
