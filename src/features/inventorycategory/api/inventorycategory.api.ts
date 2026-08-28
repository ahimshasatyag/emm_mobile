import api from '../../../services/api/api';
import { InventoryCategoryData, InventoryCategoryFormData } from '../types/inventorycategory.types';

export const fetchInventoryCategoryApi = async (): Promise<InventoryCategoryData[]> => {
    try {
        const response = await api.get('/inventorycategory');
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Gagal mengambil data kategori inventori');
    }
};

export const fetchInventoryCategoryByIdApi = async (id: string): Promise<InventoryCategoryData> => {
    try {
        const response = await api.get(`/inventorycategory/${id}`);
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Gagal mengambil detail kategori inventori');
    }
};

export const createInventoryCategoryApi = async (data: InventoryCategoryFormData): Promise<InventoryCategoryData> => {
    try {
        const response = await api.post('/inventorycategory', data);
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Gagal membuat kategori inventori');
    }
};

export const updateInventoryCategoryApi = async (id: string, data: InventoryCategoryFormData): Promise<InventoryCategoryData> => {
    try {
        const response = await api.put(`/inventorycategory/${id}`, data);
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Gagal memperbarui kategori inventori');
    }
};

export const deleteInventoryCategoryApi = async (id: string): Promise<void> => {
    try {
        await api.delete(`/inventorycategory/${id}`);
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Gagal menghapus kategori inventori');
    }
};
