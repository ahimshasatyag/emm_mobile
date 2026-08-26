export interface User {
    id_user: number;
    username: string;
    nm_users: string;
    id_users_level: number;
    id_karyawan: number;
}

export interface LoginRequest {
    username: string;
    password?: string;
}

export interface LoginResponse {
    user: User;
    message?: string;
    token?: string;
}
