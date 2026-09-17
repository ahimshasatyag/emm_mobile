import { ListPaymentFilter, ListPaymentResponse } from '../types/listpayment.types';
import api from '../../../services/api/api';

export const getListPayment = async (filters: ListPaymentFilter): Promise<ListPaymentResponse> => {
    try {
        let formattedPeriode = filters.periode;
        if (filters.periode && filters.periode !== 'ALL' && filters.periode.includes('-')) {
            const [y, m] = filters.periode.split('-');
            if (y.length === 4) {
                formattedPeriode = `${m}-${y}`;
            }
        }

        const payload = {
            periode: formattedPeriode === 'ALL' ? '' : formattedPeriode,
            id_product: filters.id_product,
            id_customers: filters.id_customers,
            ck_periode: filters.periode === 'ALL' ? 'true' : 'false'
        };

        const response = await api.post('/listpayment/data-ar-report', payload);
        
        if (response.data && response.data.status) {
            return {
                status: true,
                data: response.data.data || [],
                data_lap: response.data.data_lap || []
            };
        }
        return { status: false, data: [], data_lap: [] };
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Terjadi kesalahan saat mengambil daftar Payment');
    }
};

export const getPaymentDetail = async (id: string): Promise<any> => {
    try {
        const response = await api.get(`/listpayment/view-so/${id}`);
        
        if (response.data && response.data.status) {
            const header = response.data.data || {};
            const items = response.data.data_barang || [];
            
            return {
                ...header,
                items: items
            };
        }
        return null;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Terjadi kesalahan saat mengambil detail Payment');
    }
};
