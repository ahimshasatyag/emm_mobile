import { ListSODetail, ListSOFilter, ListSOItem, ListSOListResponse } from "../types/listso.types";
import api from '../../../services/api/api';

export const getSOList = async (filters: ListSOFilter): Promise<ListSOListResponse> => {
    try {
        let formattedPeriode = filters.periode;
        if (filters.periode && filters.periode !== 'ALL' && filters.periode.includes('-')) {
            const [y, m] = filters.periode.split('-');
            if (y.length === 4) { // Jika formatnya YYYY-MM
                formattedPeriode = `${m}-${y}`;
            }
        }

        const payload = {
            periode: formattedPeriode === 'ALL' ? '' : formattedPeriode,
            id_product: filters.id_product,
            id_customers: filters.id_customers,
            ck_periode: filters.periode === 'ALL' ? 'true' : 'false'
        };

        const response = await api.post('/listso/data-ar-report', payload);
        
        if (response.data && response.data.status) {
            return {
                items: response.data.data || [],
                summary: response.data.data_lap || []
            };
        }
        return { items: [], summary: [] };
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Terjadi kesalahan saat mengambil daftar SO');
    }
};

export const getSODetail = async (id: string): Promise<ListSODetail | null> => {
    try {
        const response = await api.get(`/listso/view-so/${id}`);
        
        if (response.data && response.data.status) {
            const header = response.data.data || {};
            const items = response.data.data_barang || [];
            
            return {
                ...header,
                items: items
            } as ListSODetail;
        }
        return null;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Terjadi kesalahan saat mengambil detail SO');
    }
};
