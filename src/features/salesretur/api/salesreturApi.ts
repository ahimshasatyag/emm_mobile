import { SalesRetur, SalesReturListResponse, SalesReturDetailResponse } from '../types/salesretur.types';
import { api } from '../../../services/api/api';

export const salesReturApi = {
    // Get all sales retur
    getSalesReturs: async (search?: string): Promise<SalesReturListResponse> => {
        const response = await api.get('/salesretur', { params: { search } });
        return response.data;
    },

    // Get specific sales retur
    getSalesReturById: async (id: string): Promise<any> => {
        const response = await api.get(`/salesretur/${id}`);
        return response.data;
    },

    // Get customers
    getCustomers: async () => {
        const response = await api.get('/salesretur/support-data');
        return { data: response.data.customers };
    },

    // Get DO by customer
    getDOByCustomer: async (id_customer: string) => {
        const response = await api.post('/salesretur/get-do', { id_customer });
        return response.data;
    },

    // Get DO details
    getDODetails: async (id_do: string) => {
        const response = await api.post('/salesretur/get-do-detail', { id_do });
        return response.data;
    },

    // Create new sales retur
    createSalesRetur: async (data: any): Promise<any> => {
        const response = await api.post('/salesretur', data);
        return response.data;
    },

    // Update existing sales retur
    updateSalesRetur: async (id: string, data: any): Promise<any> => {
        const response = await api.put(`/salesretur/${id}`, data);
        return response.data;
    },

    // Confirm sales retur
    confirmSalesRetur: async (id: string): Promise<any> => {
        const response = await api.put(`/salesretur/confirm/${id}`);
        return response.data;
    },

    // Cancel sales retur
    cancelSalesRetur: async (id: string): Promise<any> => {
        const response = await api.put(`/salesretur/cancel/${id}`);
        return response.data;
    }
};
