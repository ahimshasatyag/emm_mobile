import api from '../../../services/api/api';
import { EmployeeDivisiData, EmployeeDivisiFormData } from '../types/employeedivisi.types';

export const fetchEmployeeDivisiApi = async (): Promise<EmployeeDivisiData[]> => {
    try {
        const response = await api.get('/employeedivisi');
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Gagal mengambil data divisi');
    }
};

export const fetchEmployeeDivisiByIdApi = async (id: string): Promise<EmployeeDivisiData> => {
    try {
        const response = await api.get(`/employeedivisi/${id}`);
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Gagal mengambil detail divisi');
    }
};

export const createEmployeeDivisiApi = async (data: EmployeeDivisiFormData): Promise<EmployeeDivisiData> => {
    try {
        const response = await api.post('/employeedivisi', data);
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Gagal membuat divisi');
    }
};

export const updateEmployeeDivisiApi = async (id: string, data: EmployeeDivisiFormData): Promise<EmployeeDivisiData> => {
    try {
        const response = await api.put(`/employeedivisi/${id}`, data);
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Gagal memperbarui divisi');
    }
};

export const deleteEmployeeDivisiApi = async (id: string): Promise<void> => {
    try {
        await api.delete(`/employeedivisi/${id}`);
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Gagal menghapus divisi');
    }
};
