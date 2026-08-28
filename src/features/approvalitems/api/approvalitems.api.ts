import api from '../../../services/api/api';
import { ApprovalItemData, ApprovalItemFormData } from '../types/approvalitems.types';

export const fetchApprovalItemsApi = async (): Promise<ApprovalItemData[]> => {
    try {
        const response = await api.get('/approvalitems');
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Gagal mengambil data rule persetujuan');
    }
};

export const fetchApprovalItemByIdApi = async (id: string): Promise<ApprovalItemData> => {
    try {
        const response = await api.get(`/approvalitems/${id}`);
        const data = response.data.data;
        return {
            ...data.rule,
            level_ids: data.selected_level_ids || [],
        };
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Gagal mengambil detail rule persetujuan');
    }
};

export const createApprovalItemApi = async (data: ApprovalItemFormData): Promise<ApprovalItemData> => {
    try {
        const response = await api.post('/approvalitems', data);
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Gagal membuat rule persetujuan');
    }
};

export const updateApprovalItemApi = async (id: string, data: ApprovalItemFormData): Promise<ApprovalItemData> => {
    try {
        const response = await api.put(`/approvalitems/${id}`, data);
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Gagal memperbarui rule persetujuan');
    }
};

export const deleteApprovalItemApi = async (id: string): Promise<void> => {
    try {
        await api.delete(`/approvalitems/${id}`);
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Gagal menghapus rule persetujuan');
    }
};
