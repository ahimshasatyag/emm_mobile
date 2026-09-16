import { useState, useEffect } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { LogbookCustomer } from '../types/logbookcustomers.types';
import {
    createLogbookCustomer,
    updateLogbookCustomer,
    fetchLogbookCustomerDetail,
    fetchLogbookCustomersCreateMasterData,
    deleteLogbookCustomer,
    clearCurrent
} from '../stores/logbookcustomersSlice';
import { notificationService } from '../../../services/notification/notificationService';

export function useLogbookCustomersForm(idLogbook?: string) {
    const dispatch = useAppDispatch();
    const { current, masterDataCustomers, isLoading } = useAppSelector(state => state.logbookcustomers);
    const authUser = useAppSelector((state) => state.auth.user);

    const [formData, setFormData] = useState<Partial<LogbookCustomer>>({
        id_customers: '',
        masalah: '',
        solusi: '',
        catatan: '',
        date_log_book: new Date().toISOString().split('T')[0],
    });

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (idLogbook) {
            dispatch(fetchLogbookCustomerDetail(idLogbook));
        } else {
            dispatch(fetchLogbookCustomersCreateMasterData());
        }

        return () => {
            dispatch(clearCurrent());
        };
    }, [idLogbook, dispatch]);

    useEffect(() => {
        if (current && idLogbook) {
            setFormData({
                id_customers: current.id_customers?.toString() || '',
                masalah: current.masalah || '',
                solusi: current.solusi || '',
                catatan: current.catatan || '',
                date_log_book: current.date_log_book ? current.date_log_book.split(' ')[0] : new Date().toISOString().split('T')[0],
            });
        }
    }, [current, idLogbook]);

    const updateField = (field: keyof LogbookCustomer, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const resetForm = () => {
        setFormData({
            id_customers: '',
            masalah: '',
            solusi: '',
            catatan: '',
            date_log_book: new Date().toISOString().split('T')[0],
        });
    };

    const validate = () => {
        if (!formData.id_customers && !formData.masalah && !formData.solusi) {
            return 'Semua field wajib diisi';
        }

        if (!formData.id_customers) return "Customer wajib diisi";
        if (!formData.date_log_book) return "Tanggal wajib diisi";
        return null;
    };

    const handleSave = async (onSuccess?: (id: string) => void) => {
        setIsSaving(true);
        try {
            const payload = {
                ...formData,
                masalah_hidden: formData.masalah,
                solusi_hidden: formData.solusi,
                catatan_hidden: formData.catatan
            };

            if (idLogbook) {
                await dispatch(updateLogbookCustomer({ ...payload, id_log_book: idLogbook })).unwrap();
                
                await notificationService.store({
                    user_id: authUser?.id_user ?? 1,
                    id_users_level: authUser?.id_users_level ?? 1,
                    kode_trans: 'LOGBOOK CUSTOMERS',
                    judul: 'Logbook Customers Diperbarui',
                    pesan: `Logbook Customers berhasil diperbarui oleh ${authUser?.nm_users}`,
                    action: 'Update'
                }).catch(() => {});

                if (onSuccess) onSuccess(idLogbook);
            } else {
                const res = await dispatch(createLogbookCustomer(payload)).unwrap();
                
                await notificationService.store({
                    user_id: authUser?.id_user ?? 1,
                    id_users_level: authUser?.id_users_level ?? 1,
                    kode_trans: 'LOGBOOK CUSTOMERS',
                    judul: 'Logbook Customers Baru',
                    pesan: `Logbook Customers berhasil ditambahkan oleh ${authUser?.nm_users}`,
                    action: 'Create'
                }).catch(() => {});

                if (res?.kode && onSuccess) onSuccess(res.kode);
            }
        } catch (error: any) {
            throw error;
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (onSuccess?: () => void) => {
        if (!idLogbook) return;
        setIsSaving(true);
        try {
            await dispatch(deleteLogbookCustomer(idLogbook)).unwrap();

            await notificationService.store({
                user_id: authUser?.id_user ?? 1,
                id_users_level: authUser?.id_users_level ?? 1,
                kode_trans: 'LOGBOOK CUSTOMERS',
                judul: 'Logbook Customers Dihapus',
                pesan: `Logbook Customers berhasil dihapus oleh ${authUser?.nm_users}`,
                action: 'Delete'
            }).catch(() => {});

            if (onSuccess) onSuccess();
        } catch (error: any) {
            throw error;
        } finally {
            setIsSaving(false);
        }
    };

    return {
        formData,
        updateField,
        resetForm,
        validate,
        handleSave,
        handleDelete,
        masterDataCustomers,
        isLoading: isLoading && !isSaving,
        isSaving
    };
}
