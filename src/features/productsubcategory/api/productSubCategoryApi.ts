import { api } from '../../../services/api/api';
import { ProductSubCategoryData, ProductSubCategoryFormData } from '../types/productsubcategory.types';
import { ProductCategoryData } from '../../productcategory/types/productcategory.types';

export const productSubCategoryApi = {
    fetchSubCategories: async (): Promise<{ success: boolean; data?: ProductSubCategoryData[]; message?: string }> => {
        try {
            const response = await api.get('/productsubcategory');
            return { success: true, data: response.data.data };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || 'Gagal mengambil data sub kategori' };
        }
    },

    fetchCategoriesForSub: async (): Promise<{ success: boolean; data?: ProductCategoryData[]; message?: string }> => {
        try {
            const response = await api.get('/productsubcategory/support-data');
            return { success: true, data: response.data.data.data_kategori };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || 'Gagal mengambil data kategori' };
        }
    },

    fetchSubCategoryById: async (id: string | number): Promise<{ success: boolean; data?: ProductSubCategoryData; message?: string }> => {
        try {
            const response = await api.get(`/productsubcategory/${id}`);
            return { success: true, data: response.data.data };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || 'Gagal mengambil detail sub kategori' };
        }
    },

    createSubCategory: async (data: ProductSubCategoryFormData): Promise<{ success: boolean; data?: ProductSubCategoryData; message?: string }> => {
        try {
            const response = await api.post('/productsubcategory', data);
            return { success: true, data: response.data.data };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || 'Gagal membuat sub kategori' };
        }
    },

    updateSubCategory: async (id: string | number, data: Partial<ProductSubCategoryFormData>): Promise<{ success: boolean; data?: ProductSubCategoryData; message?: string }> => {
        try {
            const response = await api.put(`/productsubcategory/${id}`, data);
            return { success: true, data: response.data.data };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || 'Gagal memperbarui sub kategori' };
        }
    },

    deleteSubCategory: async (id: string | number): Promise<{ success: boolean; message?: string }> => {
        try {
            await api.delete(`/productsubcategory/${id}`);
            return { success: true };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || 'Gagal menghapus sub kategori' };
        }
    }
};
