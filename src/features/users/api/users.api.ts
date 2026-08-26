import api from '../../../services/api/api';
import { UserData, UserFormData, UserLevel } from '../types/users.types';

export const fetchUsersApi = async (): Promise<UserData[]> => {
    const response = await api.get('/users');
    return response.data.data;
};

export const fetchUserLevelsApi = async (): Promise<UserLevel[]> => {
    const response = await api.get('/users/levels');
    return response.data.data;
};

export const fetchUserByIdApi = async (username: string): Promise<UserData> => {
    const response = await api.get(`/users/${username}`);
    return response.data.data;
};

export const createUserApi = async (data: UserFormData): Promise<any> => {
    const response = await api.post('/users', data);
    return response.data;
};

export const updateUserApi = async (username: string, data: UserFormData): Promise<any> => {
    const response = await api.put(`/users/${username}`, data);
    return response.data;
};
