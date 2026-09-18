import api from '../../../services/api/api';
import { EmployeePosisi, EmployeePosisiFormData } from '../types/employeeposisi.types';

export const employeePosisiApi = {
    fetchEmployeePosisis: async (): Promise<{ success: boolean; data?: EmployeePosisi[]; message?: string }> => {
        try {
            const response = await api.get('/employeeposisi');
            return { success: true, data: response.data.data };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || 'Gagal mengambil data posisi karyawan' };
        }
    },

    fetchEmployeePosisiById: async (id: number): Promise<{ success: boolean; data?: EmployeePosisi; message?: string }> => {
        try {
            const response = await api.get(`/employeeposisi/${id}`);
            return { success: true, data: response.data.data };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || 'Gagal mengambil detail posisi karyawan' };
        }
    },

    createEmployeePosisi: async (data: EmployeePosisiFormData): Promise<{ success: boolean; data?: EmployeePosisi; message?: string }> => {
        try {
            const response = await api.post('/employeeposisi', data);
            return { success: true, data: response.data.data };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || 'Gagal membuat posisi karyawan' };
        }
    },

    updateEmployeePosisi: async (id: number, data: EmployeePosisiFormData): Promise<{ success: boolean; data?: EmployeePosisi; message?: string }> => {
        try {
            const response = await api.put(`/employeeposisi/${id}`, data);
            return { success: true, data: response.data.data };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || 'Gagal memperbarui posisi karyawan' };
        }
    },

    deleteEmployeePosisi: async (id: number): Promise<{ success: boolean; message?: string }> => {
        try {
            await api.delete(`/employeeposisi/${id}`);
            return { success: true };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || 'Gagal menghapus posisi karyawan' };
        }
    }
};
