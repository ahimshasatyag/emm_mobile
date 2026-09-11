import { useCallback } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import {
    fetchCustomerInvoices,
    fetchCustomerInvoiceDetail,
    submitInvoiceAction,
    clearDetail,
    clearError,
} from '../stores/customerinvoiceSlice';
import { customerinvoiceApi } from '../api/customerinvoiceApi';

export const useCustomerInvoice = () => {
    const dispatch = useAppDispatch();
    const { list, detail, loading, loadingDetail, isSubmitting, error } = useAppSelector(
        (state) => state.customerinvoice
    );

    const getList = useCallback(async (params?: Parameters<typeof customerinvoiceApi.getList>[0]) => {
        await dispatch(fetchCustomerInvoices(params ?? {}));
    }, [dispatch]);

    const getDetail = useCallback(async (id: string) => {
        await dispatch(fetchCustomerInvoiceDetail(id));
    }, [dispatch]);

    const submitAction = useCallback(async (action: string, payload: any) => {
        return await dispatch(submitInvoiceAction({ action, payload })).unwrap();
    }, [dispatch]);

    const clearInvoiceDetail = useCallback(() => {
        dispatch(clearDetail());
    }, [dispatch]);

    const clearInvoiceError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    // Support data fetchers (called directly, not via Redux)
    const getSupportData = useCallback(async (id_invoice: string | number) => {
        return await customerinvoiceApi.getSupportData(id_invoice);
    }, []);

    const getArPelunasan = useCallback(async (id_invoice: string | number, id_invoice_dtl: string | number) => {
        return await customerinvoiceApi.getArPelunasan(id_invoice, id_invoice_dtl);
    }, []);

    const getRetur = useCallback(async (id_invoice: string | number) => {
        return await customerinvoiceApi.getRetur(id_invoice);
    }, []);

    const getKbMasuk = useCallback(async (id_invoice: string | number) => {
        return await customerinvoiceApi.getKbMasuk(id_invoice);
    }, []);

    const getDataGiro = useCallback(async (params: Parameters<typeof customerinvoiceApi.getDataGiro>[0]) => {
        return await customerinvoiceApi.getDataGiro(params);
    }, []);

    const validatePayment = useCallback((data: any) => {
        if (!data.id_payment_method) return 'Payment Method wajib dipilih.';
        if (!data.v_amount || Number(data.v_amount) <= 0) return 'Amount wajib diisi dan harus lebih dari 0.';
        if (!data.date_payment) return 'Tanggal pembayaran wajib diisi.';
        return null;
    }, []);

    return {
        list,
        detail,
        loading,
        loadingDetail,
        isSubmitting,
        error,
        getList,
        getDetail,
        submitAction,
        clearInvoiceDetail,
        clearInvoiceError,
        getSupportData,
        getArPelunasan,
        getRetur,
        getKbMasuk,
        getDataGiro,
        validatePayment,
    };
};
