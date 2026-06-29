import { useState, useEffect } from 'react';
import { UserFormData } from '../types/users.types';
import { createUserApi, updateUserApi, fetchUserByIdApi } from '../api/users.api';
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
        name: '',
        level: '',
        status: '',
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
                name: user.name,
                level: user.level,
                status: user.status,
            });
        } catch (err: any) {
            setError(err.message || 'Gagal memuat data pengguna');
        } finally {
            setIsFetching(false);
        }
    };

    const validateForm = (): string | null => {
        if (!formData.username) return 'Username wajib diisi';
        if (!formData.name) return 'Nama wajib diisi';
        if (!formData.level) return 'Level wajib dipilih';
        if (!formData.status) return 'Status wajib dipilih';

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
                const updatedUser = await updateUserApi(userId!, formData);
                // Update local store
                const newList = usersList.map(u => u.id === userId ? updatedUser : u);
                dispatch(setData(newList));
            } else {
                const newUser = await createUserApi(formData);
                // Update local store
                dispatch(setData([newUser, ...usersList]));
            }
            return true;
        } catch (err: any) {
            setError(err.message || 'Terjadi kesalahan saat menyimpan data');
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const updateField = (field: keyof UserFormData, value: string) => {
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
    };
}
