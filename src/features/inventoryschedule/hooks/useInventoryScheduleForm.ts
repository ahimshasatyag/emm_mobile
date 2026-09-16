import { useState, useEffect, useCallback } from 'react';
import { InventorySchedule, UserItem } from '../types/inventoryschedule.types';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { loadScheduleData, submitSchedule } from '../stores/inventoryscheduleSlice';
import { notificationService } from '../../../services/notification/notificationService';
import { formatDateServer } from '../../../utils/helpers/date';

export const useInventoryScheduleList = () => {
    const dispatch = useAppDispatch();
    const { schedules, loading, error } = useAppSelector((state) => state.inventoryschedule);

    useEffect(() => {
        if (schedules.length === 0) {
            dispatch(loadScheduleData());
        }
    }, [dispatch, schedules.length]);

    const handleRefresh = useCallback(() => {
        dispatch(loadScheduleData());
    }, [dispatch]);

    return {
        schedules,
        loading,
        error,
        handleRefresh
    };
};

export const useInventoryScheduleForm = (initialData?: InventorySchedule) => {
    const dispatch = useAppDispatch();
    const authUser = useAppSelector((state) => state.auth.user);
    const { assets, users, isSaving } = useAppSelector((state) => state.inventoryschedule);

    const [formData, setFormData] = useState<Partial<InventorySchedule>>({
        asset_id: '',
        name: '',
        deskripsi: '',
        periode: 'Monthly',
        due_date: formatDateServer(new Date()),
        reminder: '',
        pic: []
    });

    useEffect(() => {
        if (assets.length === 0 || users.length === 0) {
            dispatch(loadScheduleData());
        }
    }, [dispatch, assets.length, users.length]);

    useEffect(() => {
        if (initialData) {
            setInitialData(initialData);
        }
    }, [initialData]);

    const setInitialData = (data: InventorySchedule) => {
        setFormData({
            id: data.id,
            asset_id: data.asset_id || '',
            name: data.name || '',
            deskripsi: data.deskripsi || '',
            periode: data.periode || 'Monthly',
            due_date: data.due_date || formatDateServer(new Date()),
            reminder: data.reminder || '',
            pic: data.pic || []
        });
    };

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

    const handleSave = async (onSuccess?: (savedData?: any) => void) => {
        // Construct the expected backend payload
        const payload = {
            asset_id: formData.asset_id || '',
            name: formData.name || '',
            deskripsi: formData.deskripsi || '',
            periode: formData.periode || 'Monthly',
            due_date: formData.due_date || formatDateServer(new Date()),
            reminder: formData.reminder ? formData.reminder.split(',') : [],
            username: formData.pic ? formData.pic.map(p => p.username) : []
        };

        const resultAction = await dispatch(submitSchedule({ id: formData.id, payload }));

        if (submitSchedule.fulfilled.match(resultAction)) {
            if (formData.id) {
                await notificationService.store({
                    user_id: authUser?.id_user ?? 1,
                    id_users_level: authUser?.id_users_level ?? 1,
                    kode_trans: 'SCHEDULE',
                    judul: 'Schedule Diperbarui',
                    pesan: `Schedule ${formData.name} berhasil diperbarui oleh ${authUser?.nm_users}`,
                    action: 'Update'
                }).catch(() => { });
            } else {
                await notificationService.store({
                    user_id: authUser?.id_user ?? 1,
                    id_users_level: authUser?.id_users_level ?? 1,
                    kode_trans: 'SCHEDULE',
                    judul: 'Schedule Baru',
                    pesan: `Schedule ${formData.name} berhasil ditambahkan oleh ${authUser?.nm_users}`,
                    action: 'Create'
                }).catch(() => { });
            }

            if (onSuccess) onSuccess(resultAction.payload);
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
        validateForm,
        setInitialData
    };
};
