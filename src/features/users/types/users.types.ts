export interface UserData {
    id: string;
    username: string;
    name: string;
    level: string;
    status: 'Active' | 'Inactive';
    avatarUrl?: string;
}

export interface UserFormData {
    username: string;
    password?: string; // Optional for edit mode
    name: string;
    level: string;
    status: 'Active' | 'Inactive' | '';
}
