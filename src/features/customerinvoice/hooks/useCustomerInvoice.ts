import { useCallback } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { 
    fetchCustomerInvoices, 
    fetchCustomerInvoiceDetail,
    clearDetail 
} from '../stores/customerinvoiceSlice';

export const useCustomerInvoice = () => {
    const dispatch = useAppDispatch();
    const { list, detail, loading, error } = useAppSelector((state) => state.customerinvoice);

    const getList = useCallback(async () => {
        await dispatch(fetchCustomerInvoices());
    }, [dispatch]);

    const getDetail = useCallback(async (id: string) => {
        await dispatch(fetchCustomerInvoiceDetail(id));
    }, [dispatch]);

    const clearInvoiceDetail = useCallback(() => {
        dispatch(clearDetail());
    }, [dispatch]);

    return {
        list,
        detail,
        loading,
        error,
        getList,
        getDetail,
        clearInvoiceDetail
    };
};
