import api from '../../../services/api/api';
import { CounterData, CounterFormData } from '../types/counter.types';

export const fetchCountersApi = async (): Promise<CounterData[]> => {
    try {
        const response = await api.get('/counter');
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Gagal mengambil data counter');
    }
};

export const fetchCounterByIdApi = async (id_counter: string, periode: string): Promise<CounterData> => {
    try {
        const response = await api.get(`/counter/${id_counter}/${periode}`);
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Gagal mengambil detail counter');
    }
};

export const updateCounterApi = async (id_counter: string, periode: string, data: CounterFormData): Promise<CounterData> => {
    try {
        const response = await api.put(`/counter/${id_counter}/${periode}`, data);
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Gagal memperbarui data counter');
    }
};
