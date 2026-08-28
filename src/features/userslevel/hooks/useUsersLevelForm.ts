import { useState, useEffect } from 'react';
import { UserLevelData, UserLevelFormData, DashboardOption, MenuOption, PowerOption } from '../types/userslevel.types';
import { fetchDashboardsApi, fetchMenusApi, fetchPowersApi, fetchUserLevelByIdApi, createUserLevelApi, updateUserLevelApi, deleteUserLevelApi } from '../api/userslevel.api';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { setData } from '../stores/userslevelSlice';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { notificationService } from '../../../services/notification/notificationService';

export function useUsersLevelForm(id?: string) {
    const [formData, setFormData] = useState<UserLevelFormData>({
        nm_users_level: '',
        id_dashboard: '',
        roles: [],
    });

    const [dashboards, setDashboards] = useState<DashboardOption[]>([]);
    const [menus, setMenus] = useState<MenuOption[]>([]);
    const [powers, setPowers] = useState<PowerOption[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [initialLoadDone, setInitialLoadDone] = useState(false);

    const dispatch = useAppDispatch();
    const { data: globalData } = useAppSelector((state) => state.userslevel);
    const authUser = useAppSelector((state) => state.auth.user);

    const loadData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [dRes, mRes, pRes] = await Promise.all([
                fetchDashboardsApi(),
                fetchMenusApi(),
                fetchPowersApi()
            ]);
            setDashboards(dRes);
            setMenus(mRes);
            setPowers(pRes);

            if (id) {
                const levelData = await fetchUserLevelByIdApi(id);
                setFormData({
                    nm_users_level: levelData.nm_users_level,
                    id_dashboard: levelData.id_dashboard,
                    roles: levelData.roles,
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

    const handleRoleToggle = (roleId: string) => {
        setFormData(prev => {
            const newRoles = prev.roles.includes(roleId)
                ? prev.roles.filter(r => r !== roleId)
                : [...prev.roles, roleId];
            return { ...prev, roles: newRoles };
        });
    };

    const handleRoleSelectAllInMenu = (menuId: string, shouldSelect: boolean) => {
        const menuRoles = powers.map(p => `${menuId}${p.id_users_power}`);
        setFormData(prev => {
            let newRoles = prev.roles.filter(r => !menuRoles.includes(r));
            if (shouldSelect) {
                newRoles = [...newRoles, ...menuRoles];
            }
            return { ...prev, roles: newRoles };
        });
    };

    const save = async (): Promise<boolean> => {

        setIsSaving(true);
        setError(null);
        try {
            let result: UserLevelData;
            if (id) {
                result = await updateUserLevelApi(id, formData);
                const updatedList = globalData.map(d => d.id_users_level === id ? result : d);
                dispatch(setData(updatedList));

                await notificationService.store({
                    user_id: authUser?.id_user ?? 1,
                    id_users_level: authUser?.id_users_level ?? 1,
                    kode_trans: 'USERS LEVEL',
                    judul: 'User Level Diperbarui',
                    pesan: `User Level ${formData.nm_users_level} telah berhasil diperbarui oleh ${authUser?.nm_users}`,
                    action: 'Update'
                }).catch(() => { });
            } else {
                result = await createUserLevelApi(formData);
                dispatch(setData([result, ...globalData]));

                await notificationService.store({
                    user_id: authUser?.id_user ?? 1,
                    id_users_level: authUser?.id_users_level ?? 1,
                    kode_trans: 'USERS LEVEL',
                    judul: 'User Level Baru',
                    pesan: `User Level ${formData.nm_users_level} telah berhasil ditambahkan oleh ${authUser?.nm_users}`,
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
            await deleteUserLevelApi(id);
            dispatch(setData(globalData.filter(d => d.id_users_level !== id)));

            await notificationService.store({
                user_id: authUser?.id_user ?? 1,
                id_users_level: authUser?.id_users_level ?? 1,
                kode_trans: 'USERS LEVEL',
                judul: 'User Level Dihapus',
                pesan: `User Level dengan ID ${id} telah dihapus oleh ${authUser?.nm_users}`,
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

    const validateForm = (): string | null => {
        if (!formData.nm_users_level?.trim()) return 'Nama level wajib diisi';
        if (!formData.id_dashboard) return 'Dashboard wajib dipilih';
        return null;
    };

    return {
        formData,
        setFormData,
        dashboards,
        menus,
        powers,
        isLoading,
        isSaving,
        error,
        initialLoadDone,
        handleRoleToggle,
        handleRoleSelectAllInMenu,
        save,
        remove,
        loadData,
        validateForm,
        setError,
    };
}
