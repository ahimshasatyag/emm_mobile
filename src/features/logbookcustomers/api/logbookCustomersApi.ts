import { LogbookCustomer } from '../types/logbookcustomers.types';

// Simulasi delay API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const logbookCustomersApi = {
    getAll: async (): Promise<LogbookCustomer[]> => {
        await delay(800);
        // Data diambil dari dummy, dalam implementasi asli menggunakan axios
        return [];
    },
    
    getById: async (id: string): Promise<LogbookCustomer> => {
        await delay(800);
        return {} as LogbookCustomer;
    },

    create: async (data: Partial<LogbookCustomer>): Promise<LogbookCustomer> => {
        await delay(800);
        return { ...data, id_log_book: Date.now().toString() } as LogbookCustomer;
    },

    update: async (id: string, data: Partial<LogbookCustomer>): Promise<LogbookCustomer> => {
        await delay(800);
        return { ...data, id_log_book: id } as LogbookCustomer;
    },

    delete: async (id: string): Promise<boolean> => {
        await delay(800);
        return true;
    }
};
