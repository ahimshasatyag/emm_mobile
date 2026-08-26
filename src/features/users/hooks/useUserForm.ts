import { useState, useEffect } from 'react';
import { UserFormData } from '../types/users.types';
import { createUserApi, updateUserApi, fetchUserByIdApi, fetchUsersApi } from '../api/users.api';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { setData } from '../store/usersSlice';

export function useUserForm(userId?: string) {
    const isEditMode = !!userId;
    const dispatch = useAppDispatch();
    const usersList = useAppSelector((state) => state.users.data);

    const [formData, setFormData] = useState<UserFormData>({
        username: '',
        password: '',
        nm_users: '',
        id_users_level: '',
        is_active: '',
    });

    const [isFetching, setIsFetching] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isEditMode && userId) {
            loadUser();
        }
    }, [userId]);

    const loadUser = async () => {
        setIsFetching(true);
        setError(null);
        try {
            const user = await fetchUserByIdApi(userId!);
            setFormData({
                username: user.username,
                password: '', // Do not populate password
                nm_users: user.nm_users,
                id_users_level: user.id_users_level?.toString() || '',
                is_active: user.is_active?.toString() || '',
            });
        } catch (err: any) {
            setError(err.message || 'Gagal memuat data pengguna');
        } finally {
            setIsFetching(false);
        }
    };

    const validateForm = (): string | null => {
        if (!formData.username) return 'Username wajib diisi';
        if (!formData.nm_users) return 'Nama wajib diisi';
        if (!formData.id_users_level) return 'Level wajib dipilih';
        if (formData.is_active === '') return 'Status wajib dipilih';

        // Password validation
        if (!isEditMode || (isEditMode && formData.password)) {
            if (!formData.password) return 'Password wajib diisi untuk pengguna baru';
            
            // Password must be at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
            const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*\W)(?=.*[A-Z]).{8,}/;
            if (!passwordRegex.test(formData.password)) {
                return 'Password harus min. 8 karakter, mengandung huruf besar, huruf kecil, angka, dan simbol khusus.';
            }
        }

        return null; // No error
    };

    const handleSave = async (): Promise<boolean> => {
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return false;
        }

        setIsSaving(true);
        setError(null);
        try {
            if (isEditMode) {
                await updateUserApi(userId!, formData);
                // Update local store from server to get joined tables correctly
                const result = await fetchUsersApi();
                dispatch(setData(result));
            } else {
                await createUserApi(formData);
                // Refresh list from server to get fresh relation data
                const result = await fetchUsersApi();
                dispatch(setData(result));
            }
            return true;
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Terjadi kesalahan saat menyimpan data');
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const updateField = (field: keyof UserFormData, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (error) setError(null); // Clear error on typing
    };

    return {
        formData,
        isEditMode,
        isFetching,
        isSaving,
        error,
        updateField,
        handleSave,
        loadUser,
        validateForm,
        setError,
    };
}
