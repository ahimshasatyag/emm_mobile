export interface User {
    name: string;
    email: string;
    link_foto?: string;
}

export interface LoginRequest {
    username: string;
    password?: string;
}

export interface LoginResponse {
    user: User;
    token?: string;
}
