import { MataUangResponse } from '../types/matauang.types';
import api from '../../../services/api/api';

export const fetchMataUang = async (): Promise<MataUangResponse> => {
    try {
        const response = await api.get('/matauang');
        if (response.data && response.data.status) {
            return {
                status: true,
                data: response.data.data.map((item: any) => ({
                    mata_uang: item.mata_uang,
                    kurs: typeof item.kurs === 'string' ? parseFloat(item.kurs) : item.kurs,
                    date_create: item.date_create
                }))
            };
        }
        return { status: false, data: [] };
    } catch (error) {
        console.error('Error fetching mata uang:', error);
        throw error;
    }
};
