import api from '../../../services/api/api';
import { DoItem, DoDetail } from '../types/do.types';

export const doApi = {
    getDoList: async (): Promise<DoItem[]> => {
        const response = await api.get('/do?per_page=500');
        if (response.data && response.data.data) {
            const items = response.data.data.data || response.data.data;
            if (Array.isArray(items)) {
                return items;
            }
        }
        return [];
    },

    getDoDetail: async (id: string): Promise<DoDetail> => {
        const response = await api.get(`/do/${id}`);
        if (response.data && response.data.status) {
            return response.data.data;
        }
        throw new Error('Data detail tidak ditemukan');
    },

    updateDo: async (id: string, data: any): Promise<boolean> => {
        const response = await api.post(`/do/${id}`, data);
        return !!(response.data && response.data.status);
    },

    confirmDo: async (id_do: string): Promise<boolean> => {
        const response = await api.post('/do/confirm', { id_do });
        return !!(response.data && response.data.status);
    },

    checkAvailabilityDo: async (id_do: string): Promise<boolean> => {
        const response = await api.post('/do/check-availability', { id_do });
        return !!(response.data && response.data.status);
    },

    checkPaymentDo: async (id_do: string): Promise<boolean> => {
        const response = await api.post('/do/check-payment', { id_do });
        return !!(response.data && response.data.status);
    },

    deliveredDo: async (id_do: string): Promise<boolean> => {
        const response = await api.post('/do/delivered', { id_do });
        return !!(response.data && response.data.status);
    },

    cancelDo: async (id_do: string, alasan: string, username?: string): Promise<boolean> => {
        const response = await api.post('/do/cancel', { id_do, alasan, username });
        return !!(response.data && response.data.status);
    },

    splitDo: async (id_do: string, details: any[]): Promise<boolean> => {
        const response = await api.post('/do/split', { id_do, details });
        return !!(response.data && response.data.status);
    },

    revisiDo: async (id_do: string): Promise<boolean> => {
        const response = await api.post('/do/revisi', { id_do });
        return !!(response.data && response.data.status);
    }
};
