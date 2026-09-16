import { QuotationApproval, AccountingApproval, HistoryApproval } from '../types/approve.types';
import api from '../../../services/api/api';

export interface ApproveDataResponse {
    status: boolean;
    data_quotations: QuotationApproval[];
    data_accounting: AccountingApproval[];
    data_history: HistoryApproval[];
    search?: string;
}

export const approveApi = {
    fetchApproveData: async (search?: string): Promise<ApproveDataResponse> => {
        const response = await api.get('/approve', { params: { search } });
        return response.data;
    },

    submitApproval: async (id_approval: string, action: string, status: string): Promise<{ status: boolean, message: string }> => {
        // According to the controller, it expects id_approval, aksi (from action), and status
        const response = await api.post('/approve/process', { 
            id_approval, 
            aksi: action, 
            status 
        });
        return response.data;
    }
};
