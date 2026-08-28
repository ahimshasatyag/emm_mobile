import api from '../../../services/api/api';
import { InventoryTypeData, InventoryTypeFormData } from '../types/inventorytype.types';

export const fetchInventoryTypeApi = async (): Promise<InventoryTypeData[]> => {
    try {
        const response = await api.get('/inventorytype');
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Gagal mengambil data tipe inventori');
    }
};

export const fetchInventoryTypeByIdApi = async (id: string): Promise<InventoryTypeData> => {
    try {
        const response = await api.get(`/inventorytype/${id}`);
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Gagal mengambil detail tipe inventori');
    }
};

export const createInventoryTypeApi = async (data: InventoryTypeFormData): Promise<InventoryTypeData> => {
    try {
        const response = await api.post('/inventorytype', data);
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Gagal membuat tipe inventori');
    }
};

export const updateInventoryTypeApi = async (id: string, data: InventoryTypeFormData): Promise<InventoryTypeData> => {
    try {
        const response = await api.put(`/inventorytype/${id}`, data);
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Gagal memperbarui tipe inventori');
    }
};

export const deleteInventoryTypeApi = async (id: string): Promise<void> => {
    try {
        await api.delete(`/inventorytype/${id}`);
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Gagal menghapus tipe inventori');
    }
};
