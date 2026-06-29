import { DashboardOption, MenuOption, PowerOption, UserLevelData } from '../types/userslevel.types';

export const mockDashboards: DashboardOption[] = [
    { id_dashboard: '1', nm_dashboard: 'Dashboard Utama' },
    { id_dashboard: '2', nm_dashboard: 'Dashboard Sales' },
    { id_dashboard: '3', nm_dashboard: 'Dashboard Teknisi' },
];

export const mockPowers: PowerOption[] = [
    { id_users_power: '1', nm_users_power: 'Insert' },
    { id_users_power: '2', nm_users_power: 'Read' },
    { id_users_power: '3', nm_users_power: 'Update' },
    { id_users_power: '4', nm_users_power: 'Delete' },
];

export const mockMenus: MenuOption[] = [
    { id_menu: '10101', nm_menu: 'Users', nm_folder: 'users' },
    { id_menu: '10102', nm_menu: 'Users Log', nm_folder: 'userslog' },
    { id_menu: '10103', nm_menu: 'Users Level', nm_folder: 'userslevel' },
    { id_menu: '10201', nm_menu: 'Products', nm_folder: 'products' },
    { id_menu: '10301', nm_menu: 'Customers', nm_folder: 'customers' },
];

export const mockUsersLevel: UserLevelData[] = [
    {
        id_users_level: 'L001',
        nm_users_level: 'Administrator',
        id_dashboard: '1',
        date_create: '2023-01-01 10:00:00',
        roles: ['101011', '101012', '101013', '101014', '101022', '101031', '101032', '101033', '101034'],
    },
    {
        id_users_level: 'L002',
        nm_users_level: 'Sales Manager',
        id_dashboard: '2',
        date_create: '2023-01-05 09:00:00',
        roles: ['101012', '102012', '103011', '103012', '103013'],
    },
    {
        id_users_level: 'L003',
        nm_users_level: 'Teknisi',
        id_dashboard: '3',
        date_create: '2023-02-10 14:30:00',
        roles: ['102012', '103012'],
    }
];
