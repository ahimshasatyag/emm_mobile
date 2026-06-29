import { DashboardOption, MenuOption, PowerOption, UserLevelData, UserLevelFormData } from '../types/userslevel.types';
import { mockDashboards, mockMenus, mockPowers, mockUsersLevel } from '../data/userslevel.dummy';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchUsersLevelApi = async (): Promise<UserLevelData[]> => {
    await delay(1200);
    return [...mockUsersLevel];
};

export const fetchUserLevelByIdApi = async (id: string): Promise<UserLevelData> => {
    await delay(800);
    const item = mockUsersLevel.find(u => u.id_users_level === id);
    if (!item) throw new Error('Level tidak ditemukan');
    return { ...item };
};

export const fetchDashboardsApi = async (): Promise<DashboardOption[]> => {
    await delay(400);
    return [...mockDashboards];
};

export const fetchMenusApi = async (): Promise<MenuOption[]> => {
    await delay(400);
    return [...mockMenus];
};

export const fetchPowersApi = async (): Promise<PowerOption[]> => {
    await delay(400);
    return [...mockPowers];
};

export const createUserLevelApi = async (data: UserLevelFormData): Promise<UserLevelData> => {
    await delay(1500);

    const newId = `L${Math.floor(Math.random() * 900) + 100}`;
    const newLevel: UserLevelData = {
        id_users_level: newId,
        nm_users_level: data.nm_users_level,
        id_dashboard: data.id_dashboard,
        roles: data.roles,
        date_create: new Date().toISOString().split('T').join(' ').substring(0, 19),
    };

    mockUsersLevel.unshift(newLevel);
    return newLevel;
};

export const updateUserLevelApi = async (id: string, data: UserLevelFormData): Promise<UserLevelData> => {
    await delay(1500);

    const index = mockUsersLevel.findIndex(u => u.id_users_level === id);
    if (index === -1) throw new Error('Level tidak ditemukan');

    const updatedLevel: UserLevelData = {
        ...mockUsersLevel[index],
        nm_users_level: data.nm_users_level,
        id_dashboard: data.id_dashboard,
        roles: data.roles,
        date_update: new Date().toISOString().split('T').join(' ').substring(0, 19),
    };

    mockUsersLevel[index] = updatedLevel;
    return updatedLevel;
};

export const deleteUserLevelApi = async (id: string): Promise<void> => {
    await delay(1500);
    const index = mockUsersLevel.findIndex(u => u.id_users_level === id);
    if (index === -1) throw new Error('Level tidak ditemukan');
    
    mockUsersLevel.splice(index, 1);
};
