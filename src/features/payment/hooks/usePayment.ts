import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../stores';
import { fetchPayments as fetchPaymentsThunk, setLoading, setError } from '../stores/paymentSlice';
import * as api from '../api/paymentApi';
import { PaymentFormData } from '../types/payment';
import { notificationService } from '../../../services/notification/notificationService';

export const usePayment = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { payments, isLoading, error } = useSelector((state: RootState) => state.payment);
    const authUser = useSelector((state: RootState) => state.auth.user);

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
            await notificationService.store({
                user_id: authUser?.id_user ?? 1,
                id_users_level: authUser?.id_users_level ?? 1,
                kode_trans: 'PAYMENT',
                judul: 'Payment Baru',
                pesan: `Payment berhasil ditambahkan oleh ${authUser?.nm_users}`,
                action: 'Create'
            }).catch(() => {});
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
            await notificationService.store({
                user_id: authUser?.id_user ?? 1,
                id_users_level: authUser?.id_users_level ?? 1,
                kode_trans: 'PAYMENT',
                judul: 'Payment Diperbarui',
                pesan: `Payment berhasil diperbarui oleh ${authUser?.nm_users}`,
                action: 'Update'
            }).catch(() => {});
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
            await notificationService.store({
                user_id: authUser?.id_user ?? 1,
                id_users_level: authUser?.id_users_level ?? 1,
                kode_trans: 'PAYMENT',
                judul: 'Status Payment Diperbarui',
                pesan: `Status Payment berhasil diubah menjadi ${status} oleh ${authUser?.nm_users}`,
                action: 'Update'
            }).catch(() => {});
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
            await notificationService.store({
                user_id: authUser?.id_user ?? 1,
                id_users_level: authUser?.id_users_level ?? 1,
                kode_trans: 'PAYMENT',
                judul: 'Split Payment',
                pesan: `Payment berhasil di-split oleh ${authUser?.nm_users}`,
                action: 'Update'
            }).catch(() => {});
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
            await notificationService.store({
                user_id: authUser?.id_user ?? 1,
                id_users_level: authUser?.id_users_level ?? 1,
                kode_trans: 'PAYMENT',
                judul: 'Payment Dibatalkan',
                pesan: `Payment berhasil dibatalkan oleh ${authUser?.nm_users}`,
                action: 'Cancel'
            }).catch(() => {});
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
