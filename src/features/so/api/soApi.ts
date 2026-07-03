import { SalesOrder } from '../types/so.types';
import { DUMMY_SO_LIST } from '../data/dummySO';

const DELAY = 1000;

export const soApi = {
    fetchSOList: async (): Promise<SalesOrder[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([...DUMMY_SO_LIST]);
            }, DELAY);
        });
    },

    getSOById: async (id: string): Promise<SalesOrder | undefined> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const so = DUMMY_SO_LIST.find(s => s.id_so === id);
                resolve(so);
            }, DELAY);
        });
    },

    createSO: async (data: SalesOrder): Promise<SalesOrder> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newSO = {
                    ...data,
                    id_so: Math.random().toString(36).substr(2, 9),
                    status_so: "DRAFT SALES ORDER", // default new status
                };
                resolve(newSO);
            }, DELAY);
        });
    },

    updateSO: async (id: string, data: Partial<SalesOrder>): Promise<SalesOrder> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = DUMMY_SO_LIST.findIndex(s => s.id_so === id);
                if (index === -1) {
                    reject(new Error("SO Not Found"));
                    return;
                }
                const updatedSO = { ...DUMMY_SO_LIST[index], ...data };
                resolve(updatedSO);
            }, DELAY);
        });
    },

    extendGaransi: async (id: string, days: number): Promise<{ success: boolean; message: string }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, message: `Extended garansi for ${days} days successful.` });
            }, DELAY);
        });
    }
};
