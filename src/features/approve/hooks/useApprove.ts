import { useCallback } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { 
    fetchQuotations, 
    fetchAccounting, 
    fetchHistory, 
    submitApprovalAction 
} from '../stores/approveSlice';

export const useApprove = () => {
    const dispatch = useAppDispatch();
    const { quotations, accounting, history, loading, error } = useAppSelector((state) => state.approve);

    const getQuotations = useCallback((search?: string) => {
        dispatch(fetchQuotations(search));
    }, [dispatch]);

    const getAccounting = useCallback((search?: string) => {
        dispatch(fetchAccounting(search));
    }, [dispatch]);

    const getHistory = useCallback((search?: string) => {
        dispatch(fetchHistory(search));
    }, [dispatch]);

    const submitApproval = useCallback(async (id_approval: string, action: string, status: string) => {
        const resultAction = await dispatch(submitApprovalAction({ id_approval, action, status }));
        return resultAction;
    }, [dispatch]);

    return {
        quotations,
        accounting,
        history,
        loading,
        error,
        getQuotations,
        getAccounting,
        getHistory,
        submitApproval
    };
};
