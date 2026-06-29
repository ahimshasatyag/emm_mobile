import { useState, useEffect } from 'react';
import { InventoryTypeData, InventoryTypeFormData } from '../types/inventorytype.types';
import { fetchInventoryTypeByIdApi, createInventoryTypeApi, updateInventoryTypeApi, deleteInventoryTypeApi } from '../api/inventorytype.api';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { setData } from '../stores/inventorytypeSlice';
import { useAppSelector } from '../../../hooks/useAppSelector';

export function useInventoryTypeForm(id?: string) {
    const [formData, setFormData] = useState<InventoryTypeFormData>({
        name: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [initialLoadDone, setInitialLoadDone] = useState(false);

    const dispatch = useAppDispatch();
    const { data: globalData } = useAppSelector((state) => state.inventorytype);

    const loadData = async () => {
        if (!id) return;
        setIsLoading(true);
        setError(null);
        try {
            const typeData = await fetchInventoryTypeByIdApi(id);
            setFormData({
                name: typeData.name,
            });
        } catch (err: any) {
            setError(err.message || 'Gagal memuat data form');
        } finally {
            setIsLoading(false);
            setInitialLoadDone(true);
        }
    };

    useEffect(() => {
        if (id) {
            loadData();
        } else {
            setInitialLoadDone(true);
        }
    }, [id]);

    const updateField = (field: keyof InventoryTypeFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (error) setError(null);
    };

    const validateForm = (): string | null => {
        if (!formData.name) return 'Type Name harus diisi';
        return null;
    };

    const save = async (): Promise<boolean> => {
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return false;
        }

        setIsSaving(true);
        setError(null);
        try {
            let result: InventoryTypeData;
            if (id) {
                result = await updateInventoryTypeApi(id, formData);
                const updatedList = globalData.map((d) => d.id === id ? result : d);
                dispatch(setData(updatedList));
            } else {
                result = await createInventoryTypeApi(formData);
                dispatch(setData([result, ...globalData]));
            }
            return true;
        } catch (err: any) {
            setError(err.message || 'Gagal menyimpan data');
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const remove = async (): Promise<boolean> => {
        if (!id) return false;
        setIsSaving(true);
        try {
            await deleteInventoryTypeApi(id);
            dispatch(setData(globalData.filter((d) => d.id !== id)));
            return true;
        } catch (err: any) {
            setError(err.message || 'Gagal menghapus data');
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    return {
        formData,
        isLoading,
        isSaving,
        error,
        initialLoadDone,
        updateField,
        save,
        remove,
        loadData,
    };
}
