import { useState, useEffect } from 'react';
import { SettingData, SettingFormData } from '../types/setting.types';
import { fetchSettingByIdApi, createSettingApi, updateSettingApi, deleteSettingApi } from '../api/setting.api';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { setData } from '../stores/settingSlice';
import { useAppSelector } from '../../../hooks/useAppSelector';

export function useSettingForm(id?: string) {
    const [formData, setFormData] = useState<SettingFormData>({
        setting_label: '',
        setting_key: '',
        setting_value: '',
        setting_note: '',
        setting_flag: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [initialLoadDone, setInitialLoadDone] = useState(false);

    const dispatch = useAppDispatch();
    const { data: globalData } = useAppSelector((state) => state.setting);

    const loadData = async () => {
        if (!id) return;
        setIsLoading(true);
        setError(null);
        try {
            const settingData = await fetchSettingByIdApi(id);
            setFormData({
                setting_label: settingData.setting_label,
                setting_key: settingData.setting_key,
                setting_value: settingData.setting_value,
                setting_note: settingData.setting_note,
                setting_flag: settingData.setting_flag,
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

    const updateField = (field: keyof SettingFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (error) setError(null);
    };

    const validateForm = (): string | null => {
        if (!formData.setting_label) return 'Label harus diisi';
        if (!formData.setting_key) return 'Key harus diisi';
        if (!formData.setting_value) return 'Value harus diisi';
        if (!formData.setting_flag) return 'Status harus dipilih';
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
            let result: SettingData;
            if (id) {
                result = await updateSettingApi(id, formData);
                const updatedList = globalData.map((d) => d.setting_id === id ? result : d);
                dispatch(setData(updatedList));
            } else {
                result = await createSettingApi(formData);
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
            await deleteSettingApi(id);
            dispatch(setData(globalData.filter((d) => d.setting_id !== id)));
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
