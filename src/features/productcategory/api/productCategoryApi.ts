import { api } from '../../../services/api/api';
import { ProductCategoryData, ProductCategoryFormData } from '../types/productcategory.types';

export const productCategoryApi = {
    fetchCategories: async (): Promise<{ success: boolean; data?: ProductCategoryData[]; message?: string }> => {
        try {
            const response = await api.get('/productcategory');
            return { success: true, data: response.data.data };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || 'Gagal mengambil data kategori' };
        }
    },

    fetchCategoryById: async (id: string | number): Promise<{ success: boolean; data?: ProductCategoryData; message?: string }> => {
        try {
            const response = await api.get(`/productcategory/${id}`);
            return { success: true, data: response.data.data };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || 'Gagal mengambil detail kategori' };
        }
    },

    createCategory: async (data: ProductCategoryFormData): Promise<{ success: boolean; data?: ProductCategoryData; message?: string }> => {
        try {
            const response = await api.post('/productcategory', data);
            return { success: true, data: response.data.data };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || 'Gagal membuat kategori' };
        }
    },

    updateCategory: async (id: string | number, data: Partial<ProductCategoryFormData>): Promise<{ success: boolean; data?: ProductCategoryData; message?: string }> => {
        try {
            const response = await api.put(`/productcategory/${id}`, data);
            return { success: true, data: response.data.data };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || 'Gagal memperbarui kategori' };
        }
    },

    deleteCategory: async (id: string | number): Promise<{ success: boolean; message?: string }> => {
        try {
            await api.delete(`/productcategory/${id}`);
            return { success: true };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || 'Gagal menghapus kategori' };
        }
    }
};
