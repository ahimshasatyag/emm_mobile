import api from '../../../services/api/api';
import { SalesContract, SOWithoutContract } from '../types/salescontract.types';

export const salescontractApi = {
    fetchSalesContracts: async (): Promise<SalesContract[]> => {
        const response = await api.get('/salescontract?has_sc=true');
        return response.data.data;
    },

    getSalesContractById: async (id: string): Promise<SalesContract | undefined> => {
        const response = await api.get(`/salescontract/${id}`);
        const header = response.data.data_header_sc;
        const detail = response.data.data_detail_sc;

        if (!header) return undefined;

        return {
            ...header,
            items: detail || [],
        };
    },

    fetchSOWithoutContract: async (): Promise<SOWithoutContract[]> => {
        const response = await api.get('/salescontract?has_sc=false');
        return response.data.data;
    },
    
    getSOWithoutContractById: async (id: string): Promise<SOWithoutContract | undefined> => {
        const response = await api.get(`/salescontract/create/${id}`);
        const header = response.data.data_header_so;
        const detail = response.data.data_detail_so;

        if (!header) return undefined;

        return {
            ...header,
            items: (detail || []).map((item: any) => ({
                ...item,
                n_qty: item.nqty || item.n_qty
            })),
        };
    },

    createSalesContract: async (data: any): Promise<{ id_sales_contract: string, kode: string, message: string }> => {
        const response = await api.post('/salescontract', data);
        return response.data;
    },

    updateSalesContract: async (id: string, data: any): Promise<{ status: boolean, message: string }> => {
        const response = await api.put(`/salescontract/${id}`, data);
        return response.data;
    }
};
