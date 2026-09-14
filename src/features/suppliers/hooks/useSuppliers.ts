import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../stores';
import { setSuppliers, setLoading, setError } from '../stores/suppliersSlice';
import { fetchSuppliers, getSupplierById, getSupportData, createSupplier, updateSupplier } from '../api/suppliers.api';
import { notificationService } from '../../../services/notification/notificationService';
import { useAppSelector } from '../../../hooks/useAppSelector';

export const useSuppliers = () => {
    const dispatch = useDispatch();
    const { suppliers, isLoading, error } = useSelector((state: RootState) => state.suppliers);
    const authUser = useAppSelector((state) => state.auth.user);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const loadSuppliers = useCallback(async (search?: string) => {
        dispatch(setLoading(true));
        try {
            const response = await fetchSuppliers(search);
            // Check if response has pagination wrapper or is direct array
            const data = Array.isArray(response.data) ? response.data : ((response.data as any)?.data || []);
            dispatch(setSuppliers(data));
            dispatch(setError(null));
        } catch (err: any) {
            dispatch(setError(err.message || 'Gagal memuat data supplier'));
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const refreshSuppliers = useCallback(async (search?: string) => {
        setIsRefreshing(true);
        try {
            const response = await fetchSuppliers(search);
            const data = Array.isArray(response.data) ? response.data : ((response.data as any)?.data || []);
            dispatch(setSuppliers(data));
            dispatch(setError(null));
        } catch (err: any) {
            dispatch(setError(err.message || 'Gagal refresh data supplier'));
        } finally {
            setIsRefreshing(false);
        }
    }, [dispatch]);

    const loadSupplierById = useCallback(async (id: string) => {
        try {
            const response = await getSupplierById(id);
            return response;
        } catch (error) {
            throw error;
        }
    }, []);

    const loadSupportData = useCallback(async () => {
        try {
            const response = await getSupportData();
            return response;
        } catch (error) {
            throw error;
        }
    }, []);

    const submitSupplier = useCallback(async (formData: FormData, isEdit: boolean, id?: string) => {
        try {
            let res;
            if (isEdit && id) {
                res = await updateSupplier(id, formData);
            } else {
                res = await createSupplier(formData);
            }

            const nmSuppliers = formData.get('nm_suppliers') as string || 'Supplier';

            if (isEdit) {
                await notificationService.store({
                    user_id: authUser?.id_user ?? 1,
                    id_users_level: authUser?.id_users_level ?? 1,
                    kode_trans: 'SUPPLIER',
                    judul: 'Supplier Diperbarui',
                    pesan: `Supplier ${nmSuppliers} berhasil diperbarui oleh ${authUser?.nm_users}`,
                    action: 'Update'
                }).catch(() => {});
            } else {
                await notificationService.store({
                    user_id: authUser?.id_user ?? 1,
                    id_users_level: authUser?.id_users_level ?? 1,
                    kode_trans: 'SUPPLIER',
                    judul: 'Supplier Baru',
                    pesan: `Supplier ${nmSuppliers} berhasil ditambahkan oleh ${authUser?.nm_users}`,
                    action: 'Create'
                }).catch(() => {});
            }

            return res;
        } catch (error) {
            throw error;
        }
    }, [authUser]);

    return {
        suppliers,
        isLoading,
        isRefreshing,
        error,
        loadSuppliers,
        refreshSuppliers,
        loadSupplierById,
        loadSupportData,
        submitSupplier
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
