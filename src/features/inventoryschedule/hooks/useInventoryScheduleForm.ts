import { useState, useEffect } from 'react';
import { InventorySchedule, UserItem } from '../types/inventoryschedule.types';
import { saveSchedule, updateSchedule } from '../api/inventoryscheduleApi';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { fetchAssetsList, fetchUsersList } from '../stores/inventoryscheduleSlice';

export const useInventoryScheduleForm = (initialData?: InventorySchedule) => {
    const dispatch = useAppDispatch();
    const { assets, users } = useAppSelector((state) => state.inventoryschedule);

    const [formData, setFormData] = useState<Partial<InventorySchedule>>({
        asset_id: '',
        name: '',
        deskripsi: '',
        periode: 'Monthly',
        due_date: new Date().toISOString().split('T')[0],
        reminder: '',
        pic: []
    });

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        dispatch(fetchAssetsList());
        dispatch(fetchUsersList());
    }, [dispatch]);

    useEffect(() => {
        if (initialData) {
            setFormData({
                id: initialData.id,
                asset_id: initialData.asset_id || '',
                name: initialData.name || '',
                deskripsi: initialData.deskripsi || '',
                periode: initialData.periode || 'Monthly',
                due_date: initialData.due_date || new Date().toISOString().split('T')[0],
                reminder: initialData.reminder || '',
                pic: initialData.pic || []
            });
        }
    }, [initialData]);

    const handleChange = (key: keyof InventorySchedule, value: any) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleReminderChange = (days: string) => {
        setFormData((prev) => {
            const currentReminders = prev.reminder ? prev.reminder.split(',') : [];
            let newReminders;
            if (currentReminders.includes(days)) {
                newReminders = currentReminders.filter((d) => d !== days);
            } else {
                newReminders = [...currentReminders, days];
            }
            return { ...prev, reminder: newReminders.join(',') };
        });
    };

    const handlePicChange = (username: string) => {
        setFormData((prev) => {
            const currentPics = prev.pic || [];
            const isSelected = currentPics.some((p) => p.username === username);
            let newPics;

            if (isSelected) {
                newPics = currentPics.filter((p) => p.username !== username);
            } else {
                const user = users.find((u) => u.username === username);
                newPics = user ? [...currentPics, user] : currentPics;
            }
            return { ...prev, pic: newPics };
        });
    };

    const handleSave = async (onSuccess?: (savedData?: InventorySchedule) => void) => {
        setIsSaving(true);
        try {
            let res;
            if (formData.id) {
                res = await updateSchedule(formData.id, formData);
            } else {
                res = await saveSchedule(formData);
            }
            if (onSuccess) onSuccess(res);
        } catch (error) {
        } finally {
            setIsSaving(false);
        }
    };

    const validateForm = (): string | null => {
        if (!formData.asset_id && !formData.name?.trim() && !formData.due_date && (!formData.pic || formData.pic.length === 0)) {
            return 'Semua field wajib diisi';
        }

        if (!formData.asset_id) {
            return 'Asset ID wajib dipilih!';
        }
        if (!formData.name?.trim()) {
            return 'Payment Name wajib diisi!';
        }
        if (!formData.pic || formData.pic.length === 0) {
            return 'PIC wajib dipilih minimal satu';
        }
        return null;
    };

    return {
        formData,
        assets,
        users,
        isSaving,
        handleChange,
        handleReminderChange,
        handlePicChange,
        handleSave,
        validateForm
    };
};
