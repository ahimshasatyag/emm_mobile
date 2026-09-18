import { LeadsItem, LeadsDetail, LeadsFormData } from '../types/leads.types';
import api from '../../../services/api/api';

export const fetchLeads = async (): Promise<LeadsItem[]> => {
    const response = await api.get('/leads');
    return response.data.data;
};

export const fetchLeadDetail = async (id: string): Promise<LeadsDetail> => {
    const response = await api.get(`/leads/${id}`);
    const data = response.data.data;
    return {
        ...data.header,
        products: data.items ? data.items.map((item: any) => ({
            id_product: item.id_product,
            code_product: item.code_product,
            nm_product: item.nm_product,
            nm_product_satuan: item.nm_product_satuan,
            product_price: item.product_price,
            qty: item.qty,
            persentase: item.persentase,
            total: item.total
        })) : [],
        visits: data.visits || []
    };
};

export const createLead = async (data: LeadsFormData): Promise<any> => {
    const response = await api.post('/leads', data);
    return response.data;
};

export const updateLead = async (id: string, data: LeadsFormData): Promise<any> => {
    const response = await api.put(`/leads/${id}`, data);
    return response.data;
};

export const deleteLead = async (id: string): Promise<any> => {
    const response = await api.delete(`/leads/${id}`);
    return response.data;
};

export const updateLeadStatus = async (id: string, status: string): Promise<any> => {
    const response = await api.put(`/leads/${id}/status`, { status });
    return response.data;
};
