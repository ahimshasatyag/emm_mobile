import { useState, useEffect } from 'react';
import { EmployeeDivisiData, EmployeeDivisiFormData } from '../types/employeedivisi.types';
import { fetchEmployeeDivisiByIdApi, createEmployeeDivisiApi, updateEmployeeDivisiApi, deleteEmployeeDivisiApi } from '../api/employeedivisi.api';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { setData } from '../stores/employeedivisiSlice';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { notificationService } from '../../../services/notification/notificationService';

export function useEmployeeDivisiForm(id?: string) {
    const [formData, setFormData] = useState<EmployeeDivisiFormData>({
        nm_karyawan_divisi: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [initialLoadDone, setInitialLoadDone] = useState(false);

    const dispatch = useAppDispatch();
    const { data: globalData } = useAppSelector((state) => state.employeedivisi);
    const authUser = useAppSelector((state) => state.auth.user);

    const loadData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            if (id) {
                await Promise.all([
                    (async () => {
                        const divisiData = await fetchEmployeeDivisiByIdApi(id);
                        setFormData({
                            nm_karyawan_divisi: divisiData.nm_karyawan_divisi,
                        });
                    })(),
                    new Promise(resolve => setTimeout(resolve, 800))
                ]);
            } else {
                await new Promise(resolve => setTimeout(resolve, 800));
                setFormData({
                    nm_karyawan_divisi: '',
                });
            }
        } catch (err: any) {
            setError(err.message || 'Gagal memuat data form');
        } finally {
            setIsLoading(false);
            setInitialLoadDone(true);
        }
    };

    useEffect(() => {
        loadData();
    }, [id]);

    const updateField = (field: keyof EmployeeDivisiFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (error) setError(null);
    };

    const validateForm = (): string | null => {
        if (!formData.nm_karyawan_divisi) return 'Nama Divisi harus diisi';
        return null;
    };

    const save = async (): Promise<string | boolean> => {
        setIsSaving(true);
        setError(null);
        try {
            let result: EmployeeDivisiData;
            if (id) {
                result = await updateEmployeeDivisiApi(id, formData);
                const updatedList = globalData.map((d) => d.id_karyawan_divisi === id ? result : d);
                dispatch(setData(updatedList));

                await notificationService.store({
                    user_id: authUser?.id_user ?? 1,
                    id_users_level: authUser?.id_users_level ?? 1,
                    kode_trans: 'EMPLOYEE DIVISION',
                    judul: 'Divisi Diperbarui',
                    pesan: `Divisi ${formData.nm_karyawan_divisi} telah berhasil diperbarui oleh ${authUser?.nm_users}`,
                    action: 'Update'
                }).catch(() => { });
            } else {
                result = await createEmployeeDivisiApi(formData);
                dispatch(setData([result, ...globalData]));

                await notificationService.store({
                    user_id: authUser?.id_user ?? 1,
                    id_users_level: authUser?.id_users_level ?? 1,
                    kode_trans: 'EMPLOYEE DIVISION',
                    judul: 'Divisi Baru',
                    pesan: `Divisi ${formData.nm_karyawan_divisi} telah berhasil ditambahkan oleh ${authUser?.nm_users}`,
                    action: 'Create'
                }).catch(() => { });
            }
            return String(result.id_karyawan_divisi);
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
            await deleteEmployeeDivisiApi(id);
            dispatch(setData(globalData.filter((d) => d.id_karyawan_divisi !== id)));

            await notificationService.store({
                user_id: authUser?.id_user ?? 1,
                id_users_level: authUser?.id_users_level ?? 1,
                kode_trans: 'EMPLOYEE DIVISION',
                judul: 'Divisi Dihapus',
                pesan: `Divisi dengan kode ${id} telah dihapus oleh ${authUser?.nm_users}`,
                action: 'Delete'
            }).catch(() => { });

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
        validateForm,
    };
}
