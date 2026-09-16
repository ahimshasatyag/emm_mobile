import api from '../../../services/api/api';
import { KasBankInHeader, KasBankInDetail, Bank, Coa, SalesOrder } from '../types/kasbankin.types';

export const kasbankinApi = {
    fetchKasBankInList: async (): Promise<KasBankInHeader[]> => {
        const response = await api.get('/akt-kasbankin');
        if (response.data?.status) {
            // Laravel paginator returns data inside data.data
            const resultData = response.data.data;
            return (resultData?.data !== undefined ? resultData.data : resultData) || [];
        }
        throw new Error(response.data?.message || 'Failed to fetch Kas Bank In list');
    },

    fetchKasBankInById: async (id: string): Promise<{ header: KasBankInHeader, details: KasBankInDetail[] }> => {
        const response = await api.get(`/akt-kasbankin/${id}`);
        if (response.data?.status) {
            return response.data.data;
        }
        throw new Error(response.data?.message || 'Kas Bank In not found');
    },

    saveKasBankIn: async (data: { header: Partial<KasBankInHeader>, details: Partial<KasBankInDetail>[] }): Promise<KasBankInHeader> => {
        const { header, details } = data;
        
        // Map to what backend store expects
        const payload = {
            id_bank: header.id_bank,
            f_dp: header.f_dp ? 1 : 0,
            type_kb: header.type_kb,
            v_desc: header.deskripsi,
            id_so: header.id_so,
            d_bank: header.d_bank,
            v_amount: header.v_amount,
            
            // Array mappings for details
            id_coa: details.map(d => d.id_coa),
            amount: details.map(d => d.v_amount),
            deskripsi: details.map(d => d.deskripsi || ''),
        };

        const response = await api.post('/akt-kasbankin', payload);
        if (response.data?.status) {
            return {
                ...header,
                code_kb_masuk: response.data.kode,
            } as KasBankInHeader;
        }
        throw new Error(response.data?.message || 'Failed to save kas bank in');
    },

    fetchSupportData: async (): Promise<{ banks: Bank[], coas: Coa[], sos: SalesOrder[] }> => {
        const response = await api.get('/akt-kasbankin/support-data');
        if (response.data?.status) {
            return {
                banks: response.data.data_bank || [],
                coas: response.data.data_coa || [],
                sos: response.data.data_so || [],
            };
        }
        throw new Error(response.data?.message || 'Failed to fetch support data');
    },

    fetchSoDetail: async (id_so: string): Promise<SalesOrder | undefined> => {
        const response = await api.get(`/akt-kasbankin/so-detail/${id_so}`);
        if (response.data?.status) {
            return response.data.data;
        }
        return undefined;
    }
};

