import { useEffect, useState, useCallback } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { loadAssetsData, submitAsset } from '../stores/assestsSlice';
import { AssetItem, AssetSerialNumber } from '../types/assests.types';
import { notificationService } from '../../../services/notification/notificationService';

export const useAssests = () => {
    const dispatch = useAppDispatch();
    const { items, isLoading, error } = useAppSelector((state) => state.assests);

    useEffect(() => {
        if (items.length === 0) {
            dispatch(loadAssetsData());
        }
    }, [dispatch, items.length]);

    const handleRefresh = useCallback(() => {
        dispatch(loadAssetsData());
    }, [dispatch]);

    return {
        items,
        isLoading,
        error,
        handleRefresh
    };
};

export const useAssestForm = (initialData?: AssetItem) => {
    const dispatch = useAppDispatch();
    const authUser = useAppSelector((state) => state.auth.user);
    const { categories, types, isSaving, error } = useAppSelector((state) => state.assests);

    const [formData, setFormData] = useState<Partial<AssetItem>>(initialData || {
        status: 'active',
        procured_date: new Date().toISOString().split('T')[0],
        purchased_date: new Date().toISOString().split('T')[0],
        f_print: null,
    });
    const [serialNumbers, setSerialNumbers] = useState<AssetSerialNumber[]>(initialData?.serial_numbers || []);

    const handleChange = (key: keyof AssetItem, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const addSerialNumber = (sn: AssetSerialNumber) => {
        setSerialNumbers(prev => [...prev, sn]);
    };

    const updateSerialNumber = (updatedSn: AssetSerialNumber) => {
        setSerialNumbers(prev => prev.map(s => s.id === updatedSn.id ? updatedSn : s));
    };

    const removeSerialNumber = (id: string) => {
        setSerialNumbers(prev => prev.filter(s => s.id !== id));
    };

    const setMainSerialNumber = (id: string) => {
        handleChange('f_print', id);
        setSerialNumbers(prev => prev.map(s => ({
            ...s,
            f_print: s.id === id ? '1' : null
        })));
    };

    const handleSave = async (onSuccess: (savedAsset: any) => void) => {
        const payload = {
            ...formData,
            sn: serialNumbers.map(s => ({
                name_sn: s.name_sn,
                serial_number: s.serial_number
            }))
        } as any;

        // Ensure we remove properties that don't belong to the payload
        delete payload.id;
        delete payload.serial_numbers;
        delete payload.type_name;
        delete payload.category_name;

        const resultAction = await dispatch(submitAsset({ id: formData.id, payload }));
        if (submitAsset.fulfilled.match(resultAction)) {
            if (formData.id) {
                await notificationService.store({
                    user_id: authUser?.id_user ?? 1,
                    id_users_level: authUser?.id_users_level ?? 1,
                    kode_trans: 'ASSET',
                    judul: 'Asset Diperbarui',
                    pesan: `Asset ${formData.name} berhasil diperbarui oleh ${authUser?.nm_users}`,
                    action: 'Update'
                }).catch(() => {});
            } else {
                await notificationService.store({
                    user_id: authUser?.id_user ?? 1,
                    id_users_level: authUser?.id_users_level ?? 1,
                    kode_trans: 'ASSET',
                    judul: 'Asset Baru',
                    pesan: `Asset ${formData.name} berhasil ditambahkan oleh ${authUser?.nm_users}`,
                    action: 'Create'
                }).catch(() => {});
            }
            onSuccess(resultAction.payload);
        }
    };

    // Derived Date Labels based on Category
    const selectedCategory = categories.find(c => c.id === formData.inventory_category_id);
    const isVehicle = selectedCategory?.name === 'Mobil' || selectedCategory?.name === 'Motor';
    const labelProcured = isVehicle ? 'BPKB Date' : 'Procured Date';
    const labelPurchased = isVehicle ? 'STNK Date' : 'Purchase Date';

    const validateForm = (): string | null => {
        if (!formData.name && !formData.inventory_type_id && !formData.inventory_category_id && !formData.procured_date && !formData.purchased_date && !formData.status && serialNumbers.length === 0) {
            return 'Semua field wajib diisi';
        }

        if (!formData.name) return 'Asset Name harus diisi';
        if (!formData.inventory_type_id) return 'Type harus diisi';
        if (!formData.inventory_category_id) return 'Category harus diisi';
        if (!formData.procured_date) return `${labelProcured} harus diisi`;
        if (!formData.purchased_date) return `${labelPurchased} harus diisi`;
        if (!formData.status) return 'Status harus diisi';
        
        if (serialNumbers.length === 0) {
            return 'Serial Number minimal harus diisi 1';
        }

        return null;
    };

    const setInitialData = (data: AssetItem) => {
        setFormData(data);
        setSerialNumbers(data.serial_numbers || []);
    };

    return {
        formData,
        serialNumbers,
        categories,
        types,
        isSaving,
        error,
        labelProcured,
        labelPurchased,
        handleChange,
        addSerialNumber,
        updateSerialNumber,
        removeSerialNumber,
        setMainSerialNumber,
        handleSave,
        validateForm,
        setInitialData
    };
};

export function useAssestSNForm(initialData?: AssetSerialNumber | null, visible?: boolean) {
    const [name, setName] = useState('');
    const [sn, setSn] = useState('');
    const [isMain, setIsMain] = useState(false);

    useEffect(() => {
        if (visible) {
            if (initialData) {
                setName(initialData.name_sn);
                setSn(initialData.serial_number);
                setIsMain(initialData.f_print === '1');
            } else {
                setName('');
                setSn('');
                setIsMain(false);
            }
        }
    }, [visible, initialData]);

    const validateForm = (): string | null => {
        if (!name.trim() || !sn.trim()) {
            return 'Nama dan Serial Number wajib diisi';
        }
        return null;
    };

    return {
        name,
        setName,
        sn,
        setSn,
        isMain,
        setIsMain,
        validateForm
    };
}
