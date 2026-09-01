import api from '../../../services/api/api';
import { ProductSn, ProductSnFormData, ProductDataBarang } from '../types/productsn.types';

export const productsnApi = {
    getProductSns: async (): Promise<ProductSn[]> => {
        try {
            const response = await api.get('/productsn');
            return response.data.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Gagal mengambil data product SN');
        }
    },

    getSupportData: async (): Promise<{ data_barang: ProductDataBarang[] }> => {
        try {
            const response = await api.get('/productsn/support-data');
            return response.data.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Gagal mengambil support data');
        }
    },

    getProductSnById: async (id: string): Promise<ProductSn> => {
        try {
            const response = await api.get(`/productsn/${id}`);
            return response.data.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Gagal mengambil detail product SN');
        }
    },

    createProductSn: async (data: ProductSnFormData): Promise<ProductSn> => {
        try {
            const response = await api.post('/productsn', data);
            return response.data.data;
        } catch (error: any) {
            const errorMsg = error.response?.data?.message;
            const message = typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg);
            throw new Error(message || 'Gagal menambahkan product SN');
        }
    },

    updateProductSn: async (id: string, data: ProductSnFormData): Promise<ProductSn> => {
        try {
            const response = await api.put(`/productsn/${id}`, data);
            return response.data.data;
        } catch (error: any) {
            const errorMsg = error.response?.data?.message;
            const message = typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg);
            throw new Error(message || 'Gagal memperbarui product SN');
        }
    },

    deleteProductSn: async (id: string): Promise<void> => {
        try {
            await api.delete(`/productsn/${id}`);
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Gagal menghapus product SN');
        }
    }
};

