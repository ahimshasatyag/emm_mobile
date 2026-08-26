export interface UserData {
    username: string;
    nm_users: string;
    nm_users_level?: string; // from index
    id_users_level?: number; // from show
    is_active: string | number; // 'Aktif' | 'Tidak Aktif' or 1 | 0
    avatarUrl?: string; // Optional avatar field
}

export interface UserFormData {
    username: string;
    password?: string; // Optional for edit mode
    nm_users: string;
    id_users_level: string | number;
    is_active: string | number; // '1' or '0'
}

export interface UserLevel {
    id_users_level: number;
    nm_users_level: string;
}
