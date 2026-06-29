import api from '../../../services/api/api';
import { LoginRequest, LoginResponse } from '../types/auth.types';

export const loginApi = async (data: LoginRequest): Promise<LoginResponse> => {
    // Initialize CSRF cookie for Sanctum SPA stateful session
    const csrfUrl = api.defaults.baseURL?.replace('/api', '/sanctum/csrf-cookie') || 'http://localhost:8000/sanctum/csrf-cookie';
    await api.get(csrfUrl);

    // Call Login Endpoint
    const response = await api.post<LoginResponse>('/login', data);
    return response.data;
};
