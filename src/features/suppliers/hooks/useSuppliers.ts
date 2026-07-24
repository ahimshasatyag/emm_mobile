import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../stores';
import { setSuppliers, setLoading, setError } from '../stores/suppliersSlice';
import { fetchSuppliers } from '../api/suppliers.api';

export const useSuppliers = () => {
    const dispatch = useDispatch();
    const { suppliers, isLoading, error } = useSelector((state: RootState) => state.suppliers);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const loadSuppliers = useCallback(async () => {
        dispatch(setLoading(true));
        try {
            const data = await fetchSuppliers();
            dispatch(setSuppliers(data));
            dispatch(setError(null));
        } catch (err) {
            dispatch(setError('Gagal memuat data supplier'));
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const refreshSuppliers = useCallback(async () => {
        setIsRefreshing(true);
        try {
            const data = await fetchSuppliers();
            dispatch(setSuppliers(data));
            dispatch(setError(null));
        } catch (err) {
            dispatch(setError('Gagal refresh data supplier'));
        } finally {
            setIsRefreshing(false);
        }
    }, [dispatch]);

    return {
        suppliers,
        isLoading,
        isRefreshing,
        error,
        loadSuppliers,
        refreshSuppliers
    };
};

export const validateForm = (formData: any, contacts: any[]): string | null => {
    if (!formData.nm_suppliers?.trim()) return 'Nama Supplier harus diisi';
    return null;
};

export const validateContactForm = (contactData: any): string | null => {
    if (!contactData.nm_suppliers_contact?.trim()) return 'Nama kontak wajib diisi';
    return null;
};
