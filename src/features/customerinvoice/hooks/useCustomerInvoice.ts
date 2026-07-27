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

    const validatePayment = useCallback((data: any) => {
        if (!data.paymentMethod && (!data.amount || Number(data.amount) <= 0)) {
            return 'Semua field wajib diisi';
        }
        
        if (!data.paymentMethod) return 'Payment Method wajib dipilih.';
        if (!data.amount || Number(data.amount) <= 0) return 'Amount wajib diisi dan harus lebih dari 0.';
        if (!data.paymentDate) return 'Date wajib diisi.';
        return null;
    }, []);

    return {
        list,
        detail,
        loading,
        error,
        getList,
        getDetail,
        clearInvoiceDetail,
        validatePayment
    };
};
