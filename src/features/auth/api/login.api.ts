import api from '../../../services/api/api';
import { LoginRequest, LoginResponse } from '../types/auth.types';

export const loginApi = async (data: LoginRequest): Promise<LoginResponse> => {
    // Call Login Endpoint
    const response = await api.post<LoginResponse>('/login', data);
    return response.data;
};
