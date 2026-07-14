import { DoItem, DoDetail } from '../types/do.types';
import { mockDoList, mockDoDetail } from '../data/doMockData';

export const doApi = {
    getDoList: async (): Promise<DoItem[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(mockDoList);
            }, 800);
        });
    },

    getDoDetail: async (id: string): Promise<DoDetail> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const data = mockDoDetail[id];
                if (data) {
                    resolve(data);
                } else {
                    reject(new Error('Data detail tidak ditemukan'));
                }
            }, 800);
        });
    },

    submitAction: async (id: string, action: string): Promise<boolean> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true); // Simulasi sukses
            }, 1000);
        });
    }
};
