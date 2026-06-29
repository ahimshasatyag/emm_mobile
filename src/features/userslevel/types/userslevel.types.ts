export interface DashboardOption {
    id_dashboard: string;
    nm_dashboard: string;
}

export interface PowerOption {
    id_users_power: string;
    nm_users_power: string;
}

export interface MenuOption {
    id_menu: string;
    nm_menu: string;
    nm_folder: string;
}

export interface UserLevelData {
    id_users_level: string;
    nm_users_level: string;
    id_dashboard: string;
    date_create?: string;
    date_update?: string;
    roles: string[]; // array of id_menu + id_users_power combined strings (e.g. "101032")
}

export interface UserLevelFormData {
    nm_users_level: string;
    id_dashboard: string;
    roles: string[];
}
