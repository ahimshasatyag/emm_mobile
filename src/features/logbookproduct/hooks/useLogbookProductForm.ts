import { useState, useEffect } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { LogbookProduct } from '../types/logbookproduct.types';
import {
    createLogbookProduct,
    updateLogbookProduct,
    fetchLogbookProductDetail,
    fetchLogbookCreateMasterData,
    deleteLogbookProduct,
    clearCurrent
} from '../stores/logbookproductSlice';
import { notificationService } from '../../../services/notification/notificationService';

export function useLogbookProductForm(idLogbook?: string) {
    const dispatch = useAppDispatch();
    const { current, masterDataBarang, masterDataTypeKerusakan, isLoading } = useAppSelector(state => state.logbookproduct);
    const authUser = useAppSelector((state) => state.auth.user);

    const [formData, setFormData] = useState<Partial<LogbookProduct>>({
        id_product: '',
        id_type_kerusakan: '',
        masalah: '',
        solusi: '',
        catatan: '',
        date_log_book: new Date().toISOString().split('T')[0],
    });

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (idLogbook) {
            dispatch(fetchLogbookProductDetail(idLogbook));
        } else {
            dispatch(fetchLogbookCreateMasterData());
        }

        return () => {
            dispatch(clearCurrent());
        };
    }, [idLogbook, dispatch]);

    useEffect(() => {
        if (current && idLogbook) {
            setFormData({
                id_product: current.id_product?.toString() || '',
                id_type_kerusakan: current.id_type_kerusakan?.toString() || '',
                masalah: current.masalah || '',
                solusi: current.solusi || '',
                catatan: current.catatan || '',
                date_log_book: current.date_log_book ? current.date_log_book.split(' ')[0] : new Date().toISOString().split('T')[0],
            });
        }
    }, [current, idLogbook]);

    const updateField = (field: keyof LogbookProduct, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const resetForm = () => {
        setFormData({
            id_product: '',
            id_type_kerusakan: '',
            masalah: '',
            solusi: '',
            catatan: '',
            date_log_book: new Date().toISOString().split('T')[0],
        });
    };

    const validate = () => {
        if (!formData.id_product && !formData.id_type_kerusakan && !formData.masalah && !formData.solusi) {
            return 'Semua field wajib diisi';
        }

        if (!formData.id_product) return "Product wajib diisi";
        if (!formData.id_type_kerusakan) return "Tipe kerusakan wajib diisi";
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
                await dispatch(updateLogbookProduct({ ...payload, id_log_book: idLogbook })).unwrap();
                
                await notificationService.store({
                    user_id: authUser?.id_user ?? 1,
                    id_users_level: authUser?.id_users_level ?? 1,
                    kode_trans: 'LOGBOOK PRODUCT',
                    judul: 'Logbook Product Diperbarui',
                    pesan: `Logbook Product berhasil diperbarui oleh ${authUser?.nm_users}`,
                    action: 'Update'
                }).catch(() => {});

                if (onSuccess) onSuccess(idLogbook);
            } else {
                const res = await dispatch(createLogbookProduct(payload)).unwrap();
                
                await notificationService.store({
                    user_id: authUser?.id_user ?? 1,
                    id_users_level: authUser?.id_users_level ?? 1,
                    kode_trans: 'LOGBOOK PRODUCT',
                    judul: 'Logbook Product Baru',
                    pesan: `Logbook Product berhasil ditambahkan oleh ${authUser?.nm_users}`,
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
            await dispatch(deleteLogbookProduct(idLogbook)).unwrap();

            await notificationService.store({
                user_id: authUser?.id_user ?? 1,
                id_users_level: authUser?.id_users_level ?? 1,
                kode_trans: 'LOGBOOK PRODUCT',
                judul: 'Logbook Product Dihapus',
                pesan: `Logbook Product berhasil dihapus oleh ${authUser?.nm_users}`,
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
        masterDataBarang,
        masterDataTypeKerusakan,
        isLoading: isLoading && !isSaving, // Avoid showing skeleton while saving
        isSaving
    };
}
