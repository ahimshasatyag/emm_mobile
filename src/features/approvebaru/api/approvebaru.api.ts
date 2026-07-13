import { ApprovebaruItem, ApprovebaruDetail } from '../types/approvebaru.types';
import { mockPendingApprovals, mockApprovalDetail } from '../data/approvebaruMockData';

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const approvebaruApi = {
    getPendingApprovals: async (): Promise<ApprovebaruItem[]> => {
        await delay(800); // Simulate network request
        return [...mockPendingApprovals];
    },

    getApprovalDetail: async (id: number): Promise<ApprovebaruDetail> => {
        await delay(600); // Simulate network request
        const detail = mockApprovalDetail[id];
        if (!detail) {
            throw new Error('Approval not found');
        }
        return { ...detail };
    },

    submitApprove: async (id: number): Promise<{ status: string, message: string }> => {
        await delay(1000); // Simulate network request
        // In a real app, this would be a POST request to Cform/approval_approve
        return { status: 'success', message: 'Approval berhasil disetujui' };
    },

    submitReject: async (id: number, reason: string): Promise<{ status: string, message: string }> => {
        await delay(1000); // Simulate network request
        // In a real app, this would be a POST request to Cform/approval_reject
        return { status: 'success', message: 'Approval berhasil ditolak' };
    }
};
