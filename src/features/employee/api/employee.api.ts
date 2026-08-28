import api from '../../../services/api/api';
import { EmployeeData, DivisionData, PositionData } from '../types/employee.types';

export const fetchEmployeesApi = async (): Promise<EmployeeData[]> => {
    try {
        const response = await api.get('/employee');
        return response.data.data.map((item: any) => ({
            ...item,
            nm_karyawan_divisi: item.divisi?.nm_karyawan_divisi || '-',
            nm_karyawan_posisi: item.posisi?.nm_karyawan_posisi || '-'
        }));
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Gagal mengambil data karyawan');
    }
};

export const fetchEmployeeByIdApi = async (id: string): Promise<EmployeeData> => {
    try {
        const response = await api.get(`/employee/${id}`);
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Gagal mengambil detail karyawan');
    }
};

export const fetchSupportDataApi = async (): Promise<{ divisions: DivisionData[], positions: PositionData[] }> => {
    try {
        const response = await api.get('/employee/support-data');
        return {
            divisions: response.data.data.data_divisi,
            positions: response.data.data.data_posisi
        };
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Gagal mengambil data pendukung');
    }
};

export const createEmployeeApi = async (data: Omit<EmployeeData, 'id_karyawan' | 'nm_karyawan_divisi' | 'nm_karyawan_posisi'>): Promise<EmployeeData> => {
    try {
        const response = await api.post('/employee', data);
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Gagal membuat karyawan');
    }
};

export const updateEmployeeApi = async (id: string, data: Partial<EmployeeData>): Promise<EmployeeData> => {
    try {
        const response = await api.put(`/employee/${id}`, data);
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Gagal memperbarui karyawan');
    }
};

export const deleteEmployeeApi = async (id: string): Promise<void> => {
    try {
        await api.delete(`/employee/${id}`);
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Gagal menghapus karyawan');
    }
};
