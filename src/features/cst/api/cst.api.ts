import { Cst, CstDetail } from '../types/cst.types';
import api from '../../../services/api/api';

export const cstApi = {
    getAll: async (): Promise<Cst[]> => {
        const response = await api.get('/cst');
        return response.data.data;
    },

    getById: async (id: string): Promise<CstDetail> => {
        const response = await api.get(`/cst/${id}`);
        return response.data.data;
    },

    updateAction: async (id: string, action: 'DONE' | 'CANCEL', cst_by: string): Promise<any> => {
        const response = await api.post(`/cst/${id}`, { action, cst_by });
        return response.data;
    },
};
