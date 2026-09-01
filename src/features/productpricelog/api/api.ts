import api from '../../../services/api/api';
import { ProductPriceLog } from '../types/productpricelog.types';

export const productPriceLogApi = {
    getLogs: async (): Promise<ProductPriceLog[]> => {
        const response = await api.get('/productpricelog');
        return response.data.data;
    }
};
