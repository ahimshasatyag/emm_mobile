import { useState, useEffect } from 'react';
import { EmployeeData, DivisionData, PositionData } from '../types/employee.types';
import {
    createEmployeeApi,
    updateEmployeeApi,
    fetchEmployeeByIdApi,
    fetchSupportDataApi
} from '../api/employee.api';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { fetchEmployees } from '../stores/employeeSlice';
import { notificationService } from '../../../services/notification/notificationService';

const initialFormData: Omit<EmployeeData, 'id_karyawan' | 'nm_karyawan_divisi' | 'nm_karyawan_posisi'> = {
    nm_karyawan: '',
    tempat_lahir: '',
    id_karyawan_divisi: '',
    date_lahir: '',
    id_karyawan_posisi: '',
    no_hp: '',
    jenis_kelamin: 'L',
    karyawan_address: '',
    karyawan_email: '',
    flag_agent: '0',
    flag_status: '1',
};

export function useEmployeeForm(id?: string) {
    const dispatch = useAppDispatch();
    const authUser = useAppSelector((state) => state.auth.user);

    const [formData, setFormData] = useState(initialFormData);
    const [divisions, setDivisions] = useState<DivisionData[]>([]);
    const [positions, setPositions] = useState<PositionData[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [initialLoadDone, setInitialLoadDone] = useState(false);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Load dropdown references
            const [{ divisions: divs, positions: pos }] = await Promise.all([
                fetchSupportDataApi()
            ]);
            setDivisions(divs);
            setPositions(pos);

            // Load employee if editing
            if (id) {
                const data = await fetchEmployeeByIdApi(id);
                setFormData({
                    nm_karyawan: data.nm_karyawan,
                    tempat_lahir: data.tempat_lahir,
                    id_karyawan_divisi: data.id_karyawan_divisi,
                    date_lahir: data.date_lahir,
                    id_karyawan_posisi: data.id_karyawan_posisi,
                    no_hp: data.no_hp,
                    jenis_kelamin: data.jenis_kelamin,
                    karyawan_address: data.karyawan_address,
                    karyawan_email: data.karyawan_email || '',
                    flag_agent: String(data.flag_agent || '0') as '0'|'1',
                    flag_status: String(data.flag_status || '0') as '0'|'1',
                });
            }
        } catch (err: any) {
            setError(err.message || 'Gagal memuat data');
        } finally {
            setIsLoading(false);
            setInitialLoadDone(true);
        }
    };

    const updateField = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (error) setError(null);
    };

    const validateForm = () => {
        if (!formData.nm_karyawan.trim()) return 'Nama karyawan wajib diisi';
        if (!formData.tempat_lahir.trim()) return 'Tempat lahir wajib diisi';
        if (!formData.id_karyawan_divisi) return 'Divisi wajib dipilih';
        if (!formData.date_lahir) return 'Tanggal lahir wajib diisi';
        if (!formData.id_karyawan_posisi) return 'Posisi wajib dipilih';
        return null;
    };

    const save = async (): Promise<any> => {

        setIsSaving(true);
        setError(null);
        try {
            let result;
            if (id) {
                result = await updateEmployeeApi(id, formData);
                await notificationService.store({
                    user_id: authUser?.id_user ?? 1,
                    id_users_level: authUser?.id_users_level ?? 1,
                    kode_trans: 'EMPLOYEE',
                    judul: 'Employee Diperbarui',
                    pesan: `Employee ${formData.nm_karyawan} berhasil diperbarui oleh ${authUser?.nm_users}`,
                    action: 'Update'
                }).catch(() => { });
            } else {
                result = await createEmployeeApi(formData);
                await notificationService.store({
                    user_id: authUser?.id_user ?? 1,
                    id_users_level: authUser?.id_users_level ?? 1,
                    kode_trans: 'EMPLOYEE',
                    judul: 'Employee Baru',
                    pesan: `Employee ${formData.nm_karyawan} berhasil ditambahkan oleh ${authUser?.nm_users}`,
                    action: 'Create'
                }).catch(() => { });
            }
            dispatch(fetchEmployees()); // Refresh list
            return result;
        } catch (err: any) {
            setError(err.message || 'Gagal menyimpan data');
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    return {
        formData,
        divisions,
        positions,
        isLoading,
        isSaving,
        error,
        initialLoadDone,
        updateField,
        save,
        loadData,
        validateForm
    };
}
