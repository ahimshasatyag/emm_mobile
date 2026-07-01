import { LogbookProduct } from '../types/logbookproduct.types';

// Simulasi delay API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const logbookProductApi = {
    getAll: async (): Promise<LogbookProduct[]> => {
        await delay(800);
        return [];
    },
    
    getById: async (id: string): Promise<LogbookProduct> => {
        await delay(800);
        return {} as LogbookProduct;
    },

    create: async (data: Partial<LogbookProduct>): Promise<LogbookProduct> => {
        await delay(800);
        return { ...data, id_log_book: Date.now().toString() } as LogbookProduct;
    },

    update: async (id: string, data: Partial<LogbookProduct>): Promise<LogbookProduct> => {
        await delay(800);
        return { ...data, id_log_book: id } as LogbookProduct;
    },

    delete: async (id: string): Promise<boolean> => {
        await delay(800);
        return true;
    }
};
