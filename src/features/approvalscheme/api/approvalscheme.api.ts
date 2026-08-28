import api from '../../../services/api/api';
import { ApprovalSchemeData, ApprovalSchemeFormData, ApprovalRuleOption } from '../types/approvalscheme.types';

export const fetchApprovalSchemesApi = async (): Promise<ApprovalSchemeData[]> => {
    try {
        const response = await api.get('/approvalscheme');
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Gagal mengambil data skema approval');
    }
};

export const fetchApprovalSchemeByIdApi = async (id: string): Promise<ApprovalSchemeData> => {
    try {
        const response = await api.get(`/approvalscheme/${id}`);
        const data = response.data.data;
        return {
            ...data.scheme,
            rule_ids: data.selected_rule_ids || []
        };
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Gagal mengambil detail skema approval');
    }
};

export const fetchApprovalRulesApi = async (): Promise<ApprovalRuleOption[]> => {
    try {
        const response = await api.get('/approvalscheme/support-data');
        return response.data.data.rules;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Gagal mengambil data rule persetujuan');
    }
};

export const createApprovalSchemeApi = async (data: ApprovalSchemeFormData): Promise<ApprovalSchemeData> => {
    try {
        const response = await api.post('/approvalscheme', data);
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Gagal membuat skema approval');
    }
};

export const updateApprovalSchemeApi = async (id: string, data: ApprovalSchemeFormData): Promise<ApprovalSchemeData> => {
    try {
        const response = await api.put(`/approvalscheme/${id}`, data);
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Gagal memperbarui skema approval');
    }
};

export const deleteApprovalSchemeApi = async (id: string): Promise<void> => {
    try {
        await api.delete(`/approvalscheme/${id}`);
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Gagal menghapus skema approval');
    }
};
