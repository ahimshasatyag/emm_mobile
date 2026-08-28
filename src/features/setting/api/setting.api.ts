import api from '../../../services/api/api';
import { SettingData, SettingFormData } from '../types/setting.types';

export const fetchSettingsApi = async (): Promise<SettingData[]> => {
    try {
        const response = await api.get('/setting');
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Gagal mengambil data setting');
    }
};

export const fetchSettingByIdApi = async (id: string): Promise<SettingData> => {
    try {
        const response = await api.get(`/setting/${id}`);
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Gagal mengambil detail setting');
    }
};

export const createSettingApi = async (data: SettingFormData): Promise<SettingData> => {
    try {
        const response = await api.post('/setting', data);
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Gagal membuat data setting');
    }
};

export const updateSettingApi = async (id: string, data: SettingFormData): Promise<SettingData> => {
    try {
        const response = await api.put(`/setting/${id}`, data);
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Gagal memperbarui data setting');
    }
};

export const deleteSettingApi = async (id: string): Promise<void> => {
    try {
        await api.delete(`/setting/${id}`);
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Gagal menghapus data setting');
    }
};
