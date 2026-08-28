import { useState, useEffect } from 'react';
import { InventoryTypeData, InventoryTypeFormData } from '../types/inventorytype.types';
import { fetchInventoryTypeByIdApi, createInventoryTypeApi, updateInventoryTypeApi, deleteInventoryTypeApi } from '../api/inventorytype.api';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { setData } from '../stores/inventorytypeSlice';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { notificationService } from '../../../services/notification/notificationService';

export function useInventoryTypeForm(id?: string) {
    const [formData, setFormData] = useState<InventoryTypeFormData>({
        name: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [initialLoadDone, setInitialLoadDone] = useState(false);

    const dispatch = useAppDispatch();
    const { data: globalData } = useAppSelector((state) => state.inventorytype);
    const authUser = useAppSelector((state) => state.auth.user);

    const loadData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            if (id) {
                await Promise.all([
                    (async () => {
                        const typeData = await fetchInventoryTypeByIdApi(id);
                        setFormData({
                            name: typeData.name,
                        });
                    })(),
                    new Promise(resolve => setTimeout(resolve, 800))
                ]);
            } else {
                await new Promise(resolve => setTimeout(resolve, 800));
                setFormData({
                    name: '',
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

    const updateField = (field: keyof InventoryTypeFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (error) setError(null);
    };

    const validateForm = (): string | null => {
        if (!formData.name) return 'Type Name harus diisi';
        return null;
    };

    const save = async (): Promise<boolean> => {
        setIsSaving(true);
        setError(null);
        try {
            let result: InventoryTypeData;
            if (id) {
                result = await updateInventoryTypeApi(id, formData);
                const updatedList = globalData.map((d) => d.id === id ? result : d);
                dispatch(setData(updatedList));

                await notificationService.store({
                    user_id: authUser?.id_user ?? 1,
                    id_users_level: authUser?.id_users_level ?? 1,
                    kode_trans: 'INVENTORY TYPE',
                    judul: 'Inventory Type Diperbarui',
                    pesan: `Inventory Type ${formData.name} telah berhasil diperbarui oleh ${authUser?.nm_users}`,
                    action: 'Update'
                }).catch(() => { });
            } else {
                result = await createInventoryTypeApi(formData);
                dispatch(setData([result, ...globalData]));

                await notificationService.store({
                    user_id: authUser?.id_user ?? 1,
                    id_users_level: authUser?.id_users_level ?? 1,
                    kode_trans: 'INVENTORY TYPE',
                    judul: 'Inventory Type Baru',
                    pesan: `Inventory Type ${formData.name} telah berhasil ditambahkan oleh ${authUser?.nm_users}`,
                    action: 'Create'
                }).catch(() => { });
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
            await deleteInventoryTypeApi(id);
            dispatch(setData(globalData.filter((d) => d.id !== id)));

            await notificationService.store({
                user_id: authUser?.id_user ?? 1,
                id_users_level: authUser?.id_users_level ?? 1,
                kode_trans: 'INVENTORY TYPE',
                judul: 'Inventory Type Dihapus',
                pesan: `Inventory Type dengan kode ${id} telah dihapus oleh ${authUser?.nm_users}`,
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
