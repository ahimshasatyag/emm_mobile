import { useEffect, useState, useCallback } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { loadAssetsData, submitAsset } from '../stores/assestsSlice';
import { AssetItem, AssetSerialNumber } from '../types/assests.types';

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

    const handleSave = async (onSuccess: () => void) => {
        const dataToSave = {
            ...formData,
            serial_numbers: serialNumbers
        };
        const resultAction = await dispatch(submitAsset(dataToSave));
        if (submitAsset.fulfilled.match(resultAction)) {
            onSuccess();
        }
    };

    // Derived Date Labels based on Category
    const selectedCategory = categories.find(c => c.id === formData.inventory_category_id);
    const isVehicle = selectedCategory?.name === 'Mobil' || selectedCategory?.name === 'Motor';
    const labelProcured = isVehicle ? 'BPKB Date' : 'Procured Date';
    const labelPurchased = isVehicle ? 'STNK Date' : 'Purchase Date';

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
        handleSave
    };
};
