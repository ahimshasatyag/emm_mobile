import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../stores';
import { fetchPayments as fetchPaymentsThunk, addPayment, updatePaymentInState, setLoading, setError } from '../stores/paymentSlice';
import * as api from '../api/paymentApi';
import { PaymentFormData } from '../types/payment';

export const usePayment = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { payments, isLoading, error } = useSelector((state: RootState) => state.payment);

    const loadPayments = () => {
        dispatch(fetchPaymentsThunk());
    };

    const createNewPayment = async (data: PaymentFormData) => {
        dispatch(setLoading(true));
        try {
            const newPayment = await api.createPayment(data);
            dispatch(addPayment(newPayment));
            return newPayment;
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
            const updated = await api.updatePayment(id, data);
            dispatch(updatePaymentInState(updated));
            return updated;
        } catch (err: any) {
            dispatch(setError(err.message || 'Failed to update payment'));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const validateForm = (data: any): string | null => {
        if (!data.customer && !data.invoice && !data.bankTujuan && (!data.paymentDetails || data.paymentDetails.length === 0)) {
            return 'Semua field harus diisi';
        }
        if (!data.customer) return 'Customer harus dipilih';
        if (!data.invoice) return 'Invoice harus dipilih';
        if (!data.bankTujuan) return 'Bank Tujuan harus dipilih';
        if (!data.paymentDetails || data.paymentDetails.length === 0) return 'Riwayat Pembayaran tidak boleh kosong';
        return null;
    };

    return {
        payments,
        isLoading,
        error,
        loadPayments,
        createNewPayment,
        updateExistingPayment,
        validateForm
    };
};
