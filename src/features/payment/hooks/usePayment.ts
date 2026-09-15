import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../stores';
import { fetchPayments as fetchPaymentsThunk, setLoading, setError } from '../stores/paymentSlice';
import * as api from '../api/paymentApi';
import { PaymentFormData } from '../types/payment';

export const usePayment = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { payments, isLoading, error } = useSelector((state: RootState) => state.payment);

    const loadPayments = (search?: string) => {
        dispatch(fetchPaymentsThunk(search));
    };

    const loadSupportData = async () => {
        return await api.fetchSupportData();
    };

    const fetchInvoicesByCustomer = async (id_customers: string) => {
        return await api.fetchInvoiceByCustomer(id_customers);
    };

    const fetchCustomerDetailByInvoice = async (id_invoice: string) => {
        return await api.fetchCustomerByInvoice(id_invoice);
    };

    const fetchPaymentDetail = async (id: string) => {
        return await api.fetchPaymentById(id);
    };

    const createNewPayment = async (data: PaymentFormData) => {
        dispatch(setLoading(true));
        try {
            const result = await api.createPayment(data);
            return result;
        } catch (err: any) {
            dispatch(setError(err.message || 'Failed to create payment'));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const updateExistingPayment = async (id: string, data: PaymentFormData) => {
        dispatch(setLoading(true));
        try {
            const result = await api.updatePayment(id, data);
            return result;
        } catch (err: any) {
            dispatch(setError(err.message || 'Failed to update payment'));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const changePaymentStatus = async (
        ids: string[], 
        status: string, 
        tgl_status: string, 
        alasan?: string
    ) => {
        dispatch(setLoading(true));
        try {
            // Backend accepts array or string separated by '|'. Array is fine since Laravel parses it if it's sent as array.
            // Let's send as array directly.
            const result = await api.changeStatus(ids, status, tgl_status, alasan);
            return result;
        } catch (err: any) {
            dispatch(setError(err.message || 'Failed to change payment status'));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const splitExistingPayment = async (id: string, data: { id_invoice: string, id_customers: string, id_bank?: string, payments: any[] }) => {
        dispatch(setLoading(true));
        try {
            const result = await api.splitPayment(id, data);
            return result;
        } catch (err: any) {
            dispatch(setError(err.message || 'Failed to split payment'));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const cancelExistingPayment = async (id: string) => {
        dispatch(setLoading(true));
        try {
            const result = await api.cancelPayment(id);
            return result;
        } catch (err: any) {
            dispatch(setError(err.message || 'Failed to cancel payment'));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    };

    return {
        payments,
        isLoading,
        error,
        loadPayments,
        loadSupportData,
        fetchInvoicesByCustomer,
        fetchCustomerDetailByInvoice,
        fetchPaymentDetail,
        createNewPayment,
        updateExistingPayment,
        changePaymentStatus,
        splitExistingPayment,
        cancelExistingPayment
    };
};
