import { api } from '../../../services/api/api';
import { ProductUnit, ProductUnitFormData, ProductUnitResponse, ProductUnitListResponse } from '../types/productunit.types';

export const productUnitApi = {
    getUnits: async (): Promise<ProductUnitListResponse> => {
        try {
            const response = await api.get('/productunit');
            return { success: true, data: response.data.data };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || 'Gagal mengambil data satuan' };
        }
    },

    getUnitById: async (id: string): Promise<ProductUnitResponse> => {
        try {
            const response = await api.get(`/productunit/${id}`);
            return { success: true, data: response.data.data };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || 'Satuan tidak ditemukan' };
        }
    },

    createUnit: async (data: ProductUnitFormData): Promise<ProductUnitResponse> => {
        try {
            const response = await api.post('/productunit', data);
            return { 
                success: true, 
                data: response.data.data, 
                message: response.data.message || 'Satuan berhasil ditambahkan' 
            };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || 'Gagal menambahkan satuan' };
        }
    },

    updateUnit: async (id: string | number, data: ProductUnitFormData): Promise<ProductUnitResponse> => {
        try {
            const response = await api.put(`/productunit/${id}`, data);
            return { 
                success: true, 
                data: response.data.data, 
                message: response.data.message || 'Satuan berhasil diperbarui' 
            };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || 'Gagal memperbarui satuan' };
        }
    },

    deleteUnit: async (id: string | number): Promise<ProductUnitResponse> => {
        try {
            const response = await api.delete(`/productunit/${id}`);
            return { 
                success: true, 
                message: response.data.message || 'Satuan berhasil dihapus' 
            };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || 'Gagal menghapus satuan' };
        }
    }
};
