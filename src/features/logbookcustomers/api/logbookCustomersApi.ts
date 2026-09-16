import api from '../../../services/api/api';
import { LogbookCustomer, MasterDataCustomer } from '../types/logbookcustomers.types';

export const logbookCustomersApi = {
    getAll: async (): Promise<LogbookCustomer[]> => {
        const response = await api.get('/logbookcustomers');
        if (response.data.status) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Gagal memuat data logbook customers');
    },
    
    getCreateMasterData: async (): Promise<{ data_customers: MasterDataCustomer[] }> => {
        const response = await api.get('/logbookcustomers/create');
        if (response.data.status) {
            return {
                data_customers: response.data.data_customers
            };
        }
        throw new Error(response.data.message || 'Gagal memuat master data');
    },

    getById: async (id: string): Promise<{ data: LogbookCustomer, data_customers: MasterDataCustomer[] }> => {
        const response = await api.get(`/logbookcustomers/${id}`);
        if (response.data.status) {
            return {
                data: response.data.data,
                data_customers: response.data.data_customers
            };
        }
        throw new Error(response.data.message || 'Gagal memuat detail data logbook customers');
    },

    create: async (data: Partial<LogbookCustomer>): Promise<{ status: boolean, message: string, kode: string }> => {
        const response = await api.post('/logbookcustomers', data);
        if (response.data.status) {
            return response.data;
        }
        throw new Error(response.data.message || 'Gagal menyimpan data');
    },

    update: async (id: string, data: Partial<LogbookCustomer>): Promise<{ status: boolean, message: string, kode: string }> => {
        const response = await api.post('/logbookcustomers/update', { ...data, id_log_book: id });
        if (response.data.status) {
            return response.data;
        }
        throw new Error(response.data.message || 'Gagal mengupdate data');
    },

    delete: async (id: string): Promise<boolean> => {
        const response = await api.post('/logbookcustomers/delete', { id_log_book: id });
        if (response.data.status) {
            return true;
        }
        throw new Error(response.data.message || 'Gagal menghapus data');
    }
};
