import { useCallback } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { 
    fetchCsrs, 
    fetchCsrById, 
    createCsr, 
    updateCsr, 
    confirmCsr, 
    cancelCsr,
    clearCurrentRequest 
} from '../stores/csrSlice';
import { CsrPayload } from '../types/csr.types';

export const useCsr = () => {
    const dispatch = useAppDispatch();
    const { requests, currentRequest, isLoading, error } = useAppSelector(state => state.csr);

    const loadRequests = useCallback(() => {
        dispatch(fetchCsrs());
    }, [dispatch]);

    const loadRequestById = useCallback((id: string) => {
        dispatch(fetchCsrById(id));
    }, [dispatch]);

    const submitRequest = useCallback(async (payload: CsrPayload) => {
        return await dispatch(createCsr(payload)).unwrap();
    }, [dispatch]);

    const editRequest = useCallback(async (id: string, payload: Partial<CsrPayload>) => {
        return await dispatch(updateCsr({ id, payload })).unwrap();
    }, [dispatch]);

    const submitConfirmCsr = useCallback(async (id: string) => {
        return await dispatch(confirmCsr(id)).unwrap();
    }, [dispatch]);

    const submitCancelCsr = useCallback(async (id: string, memo: string) => {
        return await dispatch(cancelCsr({ id, memo })).unwrap();
    }, [dispatch]);

    const resetCurrentRequest = useCallback(() => {
        dispatch(clearCurrentRequest());
    }, [dispatch]);

    const validateForm = (formData: Partial<CsrPayload>): string | null => {
        if (!formData.id_product && !formData.customers && !formData.id_karyawan && !formData.lokasi && !formData.sts_pasang && !formData.lap_kerusakan) {
            return 'Semua field wajib diisi!';
        }
        
        if (!formData.id_product) return 'Product Name harus diisi';
        if (!formData.customers) return 'Customer Name harus diisi';
        if (!formData.id_karyawan) return 'Requestor harus diisi';
        if (!formData.lokasi) return 'Lokasi harus diisi';
        if (!formData.sts_pasang) return 'Status Pemasangan harus diisi';
        if (!formData.lap_kerusakan) return 'Catatan Kerusakan harus diisi';
        
        return null;
    };

    return {
        requests,
        currentRequest,
        isLoading,
        error,
        loadRequests,
        loadRequestById,
        submitRequest,
        editRequest,
        submitConfirmCsr,
        submitCancelCsr,
        resetCurrentRequest,
        validateForm
    };
};
