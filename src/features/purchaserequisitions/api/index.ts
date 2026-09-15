import { PurchaseRequisition } from '../types/purchaserequisitions';
import { api } from '../../../services/api/api';

export const purchaseRequisitionsApi = {
    fetchList: async (search?: string): Promise<PurchaseRequisition[]> => {
        const response = await api.get('/purchaserequisitions', { params: { search, per_page: 1000 } });
        return Array.isArray(response.data?.data) ? response.data.data : ((response.data?.data as any)?.data || []);
    },

    fetchDetail: async (id_pr: string): Promise<PurchaseRequisition> => {
        const response = await api.get(`/purchaserequisitions/${id_pr}`);
        const { data, data_detail } = response.data;
        return {
            ...data,
            details: data_detail || []
        };
    },

    create: async (data: Partial<PurchaseRequisition>): Promise<any> => {
        const payload: any = {
            username: data.username,
            date_request: data.date_request,
            date_deadline: data.date_deadline,
            jml: data.details?.length || 0,
        };

        data.details?.forEach((detail, index) => {
            const i = index + 1;
            payload[`id_product${i}`] = detail.id_product;
            payload[`qty${i}`] = detail.qty;
            payload[`note${i}`] = detail.note || '';
        });

        const response = await api.post('/purchaserequisitions', payload);
        return response.data;
    },

    update: async (id_pr: string, data: Partial<PurchaseRequisition>): Promise<any> => {
        const payload: any = {
            username: data.username,
            date_request: data.date_request,
            date_deadline: data.date_deadline,
            jml: data.details?.length || 0,
        };

        data.details?.forEach((detail, index) => {
            const i = index + 1;
            payload[`id_product${i}`] = detail.id_product;
            payload[`qty${i}`] = detail.qty;
            payload[`note${i}`] = detail.note || '';
        });

        const response = await api.put(`/purchaserequisitions/${id_pr}`, payload);
        return response.data;
    },

    ajukan: async (id_pr: string): Promise<any> => {
        const response = await api.post(`/purchaserequisitions/${id_pr}/ajukan`);
        return response.data;
    },

    supportData: async (): Promise<any> => {
        const response = await api.get('/purchaserequisitions/support-data');
        return response.data;
    },

    detailBarang: async (id_product: string): Promise<any> => {
        const response = await api.post('/purchaserequisitions/detail-barang', { id_product });
        return response.data;
    },

    listPr: async (): Promise<any> => {
        const response = await api.get('/purchaserequisitions/list-pr');
        return response.data;
    },

    simpanPo: async (data_id_pr_dtl: any[]): Promise<any> => {
        const response = await api.post('/purchaserequisitions/simpan-po', { data_id_pr_dtl });
        return response.data;
    }
};
