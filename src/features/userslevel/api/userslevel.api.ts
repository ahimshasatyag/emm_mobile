import { DashboardOption, MenuOption, PowerOption, UserLevelData, UserLevelFormData } from '../types/userslevel.types';
import { api } from '../../../services/api/api';

export const fetchUsersLevelApi = async (): Promise<UserLevelData[]> => {
    try {
        const response = await api.get('/userlevel');
        const data = response.data.data || [];
        return data.map((item: any) => ({
            id_users_level: item.id_users_level?.toString(),
            nm_users_level: item.nm_users_level,
            id_dashboard: item.id_dashboard?.toString(),
            date_create: item.date_create,
            date_update: item.date_update,
            roles: [], // Not loaded in the list to save payload
        }));
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Gagal memuat data level pengguna');
    }
};

export const fetchUserLevelByIdApi = async (id: string): Promise<UserLevelData> => {
    try {
        const response = await api.get(`/userlevel/${id}`);
        const level = response.data.data.level;
        const rolesData = response.data.data.roles || [];
        
        // Backend saves id_menu and id_users_power separately, map back to concatenated string for the frontend
        const roles = rolesData.map((r: any) => `${r.id_menu}${r.id_users_power}`);

        return {
            id_users_level: level.id_users_level?.toString(),
            nm_users_level: level.nm_users_level,
            id_dashboard: level.id_dashboard?.toString(),
            date_create: level.date_create,
            date_update: level.date_update,
            roles: roles,
        };
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Gagal memuat detail level pengguna');
    }
};

let supportDataCache: any = null;

const fetchSupportData = async () => {
    if (supportDataCache) return supportDataCache;
    // Asumsi route untuk fungsi supportData() adalah /userlevel/support-data
    // Jika route berbeda (misal /userlevel-support), sesuaikan URL di bawah ini
    const response = await api.get('/userlevel/support-data');
    supportDataCache = response.data.data;
    return supportDataCache;
};

export const fetchDashboardsApi = async (): Promise<DashboardOption[]> => {
    try {
        const data = await fetchSupportData();
        return (data.dashboards || []).map((d: any) => ({
            id_dashboard: d.id_dashboard?.toString(),
            nm_dashboard: d.nm_dashboard || d.nm_dashboard_menu || `Dashboard ${d.id_dashboard}`,
        }));
    } catch (error) {
        return [];
    }
};

export const fetchMenusApi = async (): Promise<MenuOption[]> => {
    try {
        const data = await fetchSupportData();
        return (data.menus || []).map((m: any) => ({
            id_menu: m.id_menu?.toString(),
            nm_menu: m.nm_menu,
            nm_folder: m.nm_folder,
        }));
    } catch (error) {
        return [];
    }
};

export const fetchPowersApi = async (): Promise<PowerOption[]> => {
    try {
        const data = await fetchSupportData();
        return (data.powers || []).map((p: any) => ({
            id_users_power: p.id_users_power?.toString(),
            nm_users_power: p.nm_users_power,
        }));
    } catch (error) {
        return [];
    }
};

export const createUserLevelApi = async (data: UserLevelFormData): Promise<UserLevelData> => {
    try {
        const response = await api.post('/userlevel', {
            nm_users_level: data.nm_users_level,
            id_dashboard: data.id_dashboard,
            duallistbox_role: data.roles,
        });

        return {
            id_users_level: response.data.kode?.toString() || '',
            nm_users_level: data.nm_users_level,
            id_dashboard: data.id_dashboard,
            roles: data.roles,
        };
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Gagal menyimpan data level pengguna');
    }
};

export const updateUserLevelApi = async (id: string, data: UserLevelFormData): Promise<UserLevelData> => {
    try {
        // Asumsi menggunakan method PUT/PATCH
        const response = await api.put(`/userlevel/${id}`, {
            nm_users_level: data.nm_users_level,
            id_dashboard: data.id_dashboard,
            duallistbox_role: data.roles,
        });

        return {
            id_users_level: id,
            nm_users_level: data.nm_users_level,
            id_dashboard: data.id_dashboard,
            roles: data.roles,
        };
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Gagal mengubah data level pengguna');
    }
};

export const deleteUserLevelApi = async (id: string): Promise<void> => {
    try {
        await api.delete(`/userlevel/${id}`);
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Gagal menghapus data level pengguna');
    }
};
