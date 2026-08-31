import { api } from '../../../services/api/api';
import { ProductBrandFormData, ProductBrandResponse, ProductBrandListResponse } from '../types/productbrand.types';

export const productBrandApi = {
    getAll: async (): Promise<ProductBrandListResponse> => {
        try {
            const response = await api.get('/productbrand');
            return {
                status: 'success',
                data: response.data.data
            };
        } catch (error: any) {
            throw error.response?.data?.message || 'Gagal mengambil data merek produk';
        }
    },

    getById: async (id: string): Promise<ProductBrandResponse> => {
        try {
            const response = await api.get(`/productbrand/${id}`);
            return {
                status: 'success',
                data: response.data.data
            };
        } catch (error: any) {
            throw error.response?.data?.message || 'Gagal mengambil detail merek produk';
        }
    },

    create: async (data: ProductBrandFormData): Promise<ProductBrandResponse> => {
        try {
            const response = await api.post('/productbrand', data);
            return {
                status: 'success',
                data: response.data.data
            };
        } catch (error: any) {
            let errorMsg = 'Gagal menambah merek produk';
            if (error.response?.data?.message) {
                if (typeof error.response.data.message === 'object') {
                    errorMsg = Object.values(error.response.data.message).join('\n');
                } else {
                    errorMsg = error.response.data.message;
                }
            }
            throw errorMsg;
        }
    },

    update: async (id: string, data: ProductBrandFormData): Promise<ProductBrandResponse> => {
        try {
            const response = await api.put(`/productbrand/${id}`, data);
            return {
                status: 'success',
                data: response.data.data
            };
        } catch (error: any) {
            let errorMsg = 'Gagal mengubah merek produk';
            if (error.response?.data?.message) {
                if (typeof error.response.data.message === 'object') {
                    errorMsg = Object.values(error.response.data.message).join('\n');
                } else {
                    errorMsg = error.response.data.message;
                }
            }
            throw errorMsg;
        }
    },

    delete: async (id: string): Promise<void> => {
        try {
            await api.delete(`/productbrand/${id}`);
        } catch (error: any) {
            throw error.response?.data?.message || 'Gagal menghapus merek produk';
        }
    }
};
