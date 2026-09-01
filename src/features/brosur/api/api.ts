import { BrosurProduct } from '../types/brosur.types';
import api from '../../../services/api/api';

export const brosurApi = {
    getBrosurProducts: async (): Promise<BrosurProduct[]> => {
        try {
            const response = await api.get('/brosur');
            return response.data.data;
        } catch (error) {
            throw error;
        }
    },

    generateBrosur: async (productIds: string[], withCover: boolean): Promise<{ success: boolean, url: string }> => {
        try {
            const idString = productIds.join('-');
            const coverFlag = withCover ? '1' : '0';
            
            // Mengambil base url dari axios instance
            const baseUrl = api.defaults.baseURL;
            const url = `${baseUrl}/brosur/generate?products=${idString}&cover=${coverFlag}`;
            
            return {
                success: true,
                url: url
            };
        } catch (error) {
            throw error;
        }
    }
};
