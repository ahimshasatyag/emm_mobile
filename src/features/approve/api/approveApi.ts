import { QuotationApproval, AccountingApproval, HistoryApproval } from '../types/approve.types';
import { mockQuotations, mockAccounting, mockHistory } from '../data/approveMockData';

export const approveApi = {
    fetchQuotations: async (search?: string): Promise<QuotationApproval[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (search) {
                    const filtered = mockQuotations.filter(item => 
                        item.code_so.toLowerCase().includes(search.toLowerCase()) || 
                        item.nm_customers.toLowerCase().includes(search.toLowerCase())
                    );
                    resolve(filtered);
                } else {
                    resolve(mockQuotations);
                }
            }, 800);
        });
    },

    fetchAccounting: async (search?: string): Promise<AccountingApproval[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(mockAccounting); // Mock search not fully implemented for accounting
            }, 800);
        });
    },

    fetchHistory: async (search?: string): Promise<HistoryApproval[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(mockHistory);
            }, 800);
        });
    },

    submitApproval: async (id_approval: string, action: string, status: string): Promise<{ status: boolean, message: string }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulate success
                resolve({ status: true, message: `Successfully ${action === '1' ? 'Approved' : 'Rejected'} ${id_approval}` });
            }, 1000);
        });
    }
};
