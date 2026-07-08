import { PurchaseRequisition } from '../types/purchaserequisitions';
import { DUMMY_PR_LIST, DUMMY_PR_DETAILS } from '../data/purchaserequisitions.data';

// Dummy API
export const purchaseRequisitionsApi = {
    fetchList: async (): Promise<PurchaseRequisition[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([...DUMMY_PR_LIST]);
            }, 500);
        });
    },

    fetchDetail: async (id_pr: string): Promise<PurchaseRequisition> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const pr = DUMMY_PR_LIST.find(p => p.id_pr === id_pr);
                if (pr) {
                    const details = DUMMY_PR_DETAILS[id_pr] || [];
                    resolve({ ...pr, details });
                } else {
                    reject(new Error('Purchase Requisition not found'));
                }
            }, 500);
        });
    },

    create: async (data: Partial<PurchaseRequisition>): Promise<PurchaseRequisition> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newPr: PurchaseRequisition = {
                    id_pr: `PR-${Date.now()}`,
                    code_pr: `PR-${Date.now()}`,
                    username: data.username || 'unknown',
                    date_request: data.date_request || new Date().toISOString().split('T')[0],
                    date_deadline: data.date_deadline || new Date().toISOString().split('T')[0],
                    status_pr: '',
                    ...data
                };
                
                DUMMY_PR_LIST.push(newPr);
                if (data.details) {
                    DUMMY_PR_DETAILS[newPr.id_pr] = data.details;
                }
                resolve(newPr);
            }, 500);
        });
    },

    update: async (id_pr: string, data: Partial<PurchaseRequisition>): Promise<PurchaseRequisition> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = DUMMY_PR_LIST.findIndex(p => p.id_pr === id_pr);
                if (index !== -1) {
                    const updatedPr = { ...DUMMY_PR_LIST[index], ...data };
                    DUMMY_PR_LIST[index] = updatedPr;
                    if (data.details) {
                        DUMMY_PR_DETAILS[id_pr] = data.details;
                    }
                    resolve(updatedPr);
                } else {
                    reject(new Error('Purchase Requisition not found'));
                }
            }, 500);
        });
    },
    
    ajukan: async (id_pr: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = DUMMY_PR_LIST.findIndex(p => p.id_pr === id_pr);
                if (index !== -1) {
                    DUMMY_PR_LIST[index].status_pr = 'PR';
                    resolve();
                } else {
                    reject(new Error('Purchase Requisition not found'));
                }
            }, 500);
        });
    }
};
