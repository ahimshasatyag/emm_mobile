import api from '../../../services/api/api';
import { LogbookProduct, MasterDataBarang, MasterDataTypeKerusakan } from '../types/logbookproduct.types';

export const logbookProductApi = {
    getAll: async (): Promise<LogbookProduct[]> => {
        const response = await api.get('/logbookproduct');
        return response.data?.data || [];
    },
    
    getById: async (id: string): Promise<{ data: LogbookProduct; data_barang: MasterDataBarang[]; data_type_kerusakan: MasterDataTypeKerusakan[] }> => {
        const response = await api.get(`/logbookproduct/${id}`);
        return {
            data: response.data?.data,
            data_barang: response.data?.data_barang || [],
            data_type_kerusakan: response.data?.data_type_kerusakan || []
        };
    },

    getCreateMasterData: async (): Promise<{ data_barang: MasterDataBarang[]; data_type_kerusakan: MasterDataTypeKerusakan[] }> => {
        const response = await api.get('/logbookproduct/create');
        return {
            data_barang: response.data?.data_barang || [],
            data_type_kerusakan: response.data?.data_type_kerusakan || []
        };
    },

    create: async (data: any): Promise<any> => {
        const response = await api.post('/logbookproduct', data);
        return response.data;
    },

    update: async (data: any): Promise<any> => {
        const response = await api.post('/logbookproduct/update', data);
        return response.data;
    },

    delete: async (id: string): Promise<any> => {
        const response = await api.post('/logbookproduct/delete', { id_log_book: id });
        return response.data;
    }
};
