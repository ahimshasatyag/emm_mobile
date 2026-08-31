import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../stores';
import {
    fetchUnits,
    createUnit,
    updateUnit,
    deleteUnit,
    clearError
} from '../stores/productUnitSlice';
import { ProductUnitFormData } from '../types/productunit.types';
import { notificationService } from '../../../services/notification/notificationService';
import { useAppSelector } from '../../../hooks/useAppSelector';

export function useProductUnits() {
    const dispatch = useDispatch<AppDispatch>();

    const authUser = useAppSelector((state: RootState) => state.auth.user);

    const { units, isLoading, error } = useSelector((state: RootState) => state.productUnit);
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState<ProductUnitFormData>({
        nm_product_satuan: ''
    });

    const validateForm = (): string | null => {
        if (!formData.nm_product_satuan.trim()) {
            return 'Nama Satuan wajib diisi!';
        }
        return null;
    };

    const filteredUnits = units.filter(unit =>
        (unit.nm_product_satuan || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (String(unit.id_product_satuan) || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const loadUnits = useCallback(() => {
        dispatch(fetchUnits());
    }, [dispatch]);

    const addUnit = useCallback(async (data: ProductUnitFormData) => {
        const result = await dispatch(createUnit(data)).unwrap();
        if (authUser?.id_user) {
            await notificationService.store({
                user_id: authUser.id_user,
                id_users_level: authUser.id_users_level || 1,
                kode_trans: 'UNIT',
                judul: 'Unit Baru',
                pesan: `Unit ${result.unit?.nm_product_satuan || data.nm_product_satuan} berhasil ditambahkan oleh ${authUser.nm_users}`,
                action: 'Create'
            }).catch(() => { });
        }
        return result;
    }, [dispatch, authUser]);

    const editUnit = useCallback(async (id: string, data: ProductUnitFormData) => {
        const result = await dispatch(updateUnit({ id, data })).unwrap();
        if (authUser?.id_user) {
            await notificationService.store({
                user_id: authUser.id_user,
                id_users_level: authUser.id_users_level || 1,
                kode_trans: 'UNIT',
                judul: 'Unit Diperbarui',
                pesan: `Unit ${result.unit?.nm_product_satuan || data.nm_product_satuan} berhasil diperbarui oleh ${authUser.nm_users}`,
                action: 'Update'
            }).catch(() => { });
        }
        return result;
    }, [dispatch, authUser]);

    const removeUnit = useCallback(async (id: string) => {
        const unit = units.find(c => String(c.id_product_satuan) === String(id));
        const result = await dispatch(deleteUnit(id)).unwrap();
        if (authUser?.id_user) {
            await notificationService.store({
                user_id: authUser.id_user,
                id_users_level: authUser.id_users_level || 1,
                kode_trans: 'UNIT',
                judul: 'Unit Dihapus',
                pesan: `Unit ${unit?.nm_product_satuan || id} berhasil dihapus oleh ${authUser.nm_users}`,
                action: 'Delete'
            }).catch(() => { });
        }
        return result;
    }, [dispatch, authUser, units]);

    const dismissError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    return {
        units: filteredUnits,
        allUnits: units,
        isLoading,
        error,
        searchQuery,
        setSearchQuery,
        formData,
        setFormData,
        validateForm,
        loadUnits,
        addUnit,
        editUnit,
        removeUnit,
        dismissError
    };
}
