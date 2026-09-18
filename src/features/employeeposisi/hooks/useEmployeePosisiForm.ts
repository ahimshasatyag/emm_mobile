import { useState, useEffect } from 'react';
import { EmployeePosisi, EmployeePosisiFormData } from '../types/employeeposisi.types';
import { employeePosisiApi } from '../api/employeeposisi.api';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { fetchEmployeePosisis } from '../stores/employeeposisiSlice';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { notificationService } from '../../../services/notification/notificationService';

export function useEmployeePosisiForm(id?: string) {
    const [formData, setFormData] = useState<EmployeePosisiFormData>({
        nm_karyawan_posisi: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [initialLoadDone, setInitialLoadDone] = useState(false);

    const dispatch = useAppDispatch();
    const authUser = useAppSelector((state) => state.auth.user);

    const loadData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            if (id) {
                await Promise.all([
                    (async () => {
                        const response = await employeePosisiApi.fetchEmployeePosisiById(Number(id));
                        if (response.success && response.data) {
                            setFormData({
                                nm_karyawan_posisi: response.data.nm_karyawan_posisi,
                            });
                        } else {
                            throw new Error(response.message || 'Gagal memuat data posisi');
                        }
                    })(),
                    new Promise(resolve => setTimeout(resolve, 800))
                ]);
            } else {
                await new Promise(resolve => setTimeout(resolve, 800));
                setFormData({
                    nm_karyawan_posisi: '',
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

    const updateField = (field: keyof EmployeePosisiFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (error) setError(null);
    };

    const validateForm = (): string | null => {
        if (!formData.nm_karyawan_posisi) return 'Nama Posisi harus diisi';
        return null;
    };

    const save = async (): Promise<string | boolean> => {
        setIsSaving(true);
        setError(null);
        try {
            let response;
            if (id) {
                response = await employeePosisiApi.updateEmployeePosisi(Number(id), formData);
                
                await notificationService.store({
                    user_id: authUser?.id_user ?? 1,
                    id_users_level: authUser?.id_users_level ?? 1,
                    kode_trans: 'EMPLOYEE POSITION',
                    judul: 'Posisi Diperbarui',
                    pesan: `Posisi ${formData.nm_karyawan_posisi} telah berhasil diperbarui oleh ${authUser?.nm_users}`,
                    action: 'Update'
                }).catch(() => { });
            } else {
                response = await employeePosisiApi.createEmployeePosisi(formData);
                
                await notificationService.store({
                    user_id: authUser?.id_user ?? 1,
                    id_users_level: authUser?.id_users_level ?? 1,
                    kode_trans: 'EMPLOYEE POSITION',
                    judul: 'Posisi Baru',
                    pesan: `Posisi ${formData.nm_karyawan_posisi} telah berhasil ditambahkan oleh ${authUser?.nm_users}`,
                    action: 'Create'
                }).catch(() => { });
            }

            if (response.success && response.data) {
                dispatch(fetchEmployeePosisis());
                return String(response.data.id_karyawan_posisi);
            } else {
                throw new Error(response.message || 'Gagal menyimpan data');
            }
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
            const response = await employeePosisiApi.deleteEmployeePosisi(Number(id));
            if (response.success) {
                dispatch(fetchEmployeePosisis());

                await notificationService.store({
                    user_id: authUser?.id_user ?? 1,
                    id_users_level: authUser?.id_users_level ?? 1,
                    kode_trans: 'EMPLOYEE POSITION',
                    judul: 'Posisi Dihapus',
                    pesan: `Posisi dengan kode ${id} telah dihapus oleh ${authUser?.nm_users}`,
                    action: 'Delete'
                }).catch(() => { });

                return true;
            } else {
                throw new Error(response.message || 'Gagal menghapus data');
            }
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
