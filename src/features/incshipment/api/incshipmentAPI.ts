import { IncshipmentHeader } from '../types/incshipment.types';
import { api } from '../../../services/api/api';

export const incshipmentAPI = {
    fetchList: async (search?: string): Promise<IncshipmentHeader[]> => {
        const response = await api.get('/incshipment', { params: { search, per_page: 1000 } });
        if (Array.isArray(response.data)) return response.data;
        if (Array.isArray(response.data?.data)) return response.data.data;
        if (Array.isArray(response.data?.data?.data)) return response.data.data.data;
        return [];
    },

    fetchDetail: async (id: string): Promise<IncshipmentHeader> => {
        const response = await api.get(`/incshipment/${id}`);
        const { data, data_detail } = response.data;
        return {
            ...data,
            details: data_detail || []
        };
    },

    assignSerialNumber: async (id: string): Promise<any> => {
        const response = await api.post(`/incshipment/${id}/assign-sn`);
        return response.data;
    },

    printBarcode: async (id: string): Promise<any> => {
        const response = await api.post(`/incshipment/${id}/print-barcode`);
        return response.data;
    },

    receiveGoods: async (id: string, data_barang: any[]): Promise<any> => {
        const response = await api.post(`/incshipment/${id}/receive`, { data_barang });
        return response.data;
    }
};
