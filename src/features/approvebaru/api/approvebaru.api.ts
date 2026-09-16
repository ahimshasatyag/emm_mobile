import { ApprovebaruItem, ApprovebaruDetail } from '../types/approvebaru.types';
import api from '../../../services/api/api';

export const approvebaruApi = {
    getPendingApprovals: async (): Promise<ApprovebaruItem[]> => {
        const response = await api.get('/approvebaru');
        return response.data.data_approval || [];
    },

    getApprovalDetail: async (id_approval: number): Promise<ApprovebaruDetail> => {
        const response = await api.post('/approvebaru/get-approval-details', { id_approval });
        if (response.data.status === 'error') {
            throw new Error(response.data.message || 'Approval not found');
        }
        return response.data.data;
    },

    submitApprove: async (id_approval: number): Promise<{ status: string, message: string }> => {
        const response = await api.post('/approvebaru/approval-approve', { id_approval });
        return response.data;
    },

    submitReject: async (id_approval: number, rejection_reason: string): Promise<{ status: string, message: string }> => {
        const response = await api.post('/approvebaru/approval-reject', { 
            id_approval,
            rejection_reason
        });
        return response.data;
    }
};
