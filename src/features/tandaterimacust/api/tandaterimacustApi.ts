import { TandaTerimaCustItem, CustomerData, TandaTerimaCustFile } from '../types/tandaterimacust.types';
import { DUMMY_CUSTOMERS, DUMMY_TANDA_TERIMA } from '../data/dummyData';

let mockTandaTerimaData = [...DUMMY_TANDA_TERIMA];
let nextId = 3;
let nextFileId = 100;

export const tandaterimacustApi = {
    fetchTandaTerimaCusts: async (): Promise<TandaTerimaCustItem[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([...mockTandaTerimaData]);
            }, 800);
        });
    },

    fetchCustomers: async (): Promise<CustomerData[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([...DUMMY_CUSTOMERS]);
            }, 500);
        });
    },

    fetchTandaTerimaCustById: async (id: string): Promise<TandaTerimaCustItem | undefined> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const item = mockTandaTerimaData.find(x => x.id_tanda_terima_cust === id);
                if (item) resolve({...item});
                else reject(new Error('Tanda terima tidak ditemukan'));
            }, 500);
        });
    },

    addTandaTerimaCust: async (payload: Omit<TandaTerimaCustItem, 'id_tanda_terima_cust' | 'nm_customers'>): Promise<TandaTerimaCustItem> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const customer = DUMMY_CUSTOMERS.find(c => c.id_customers === payload.id_customers);
                
                // Map files and add IDs
                const newFiles = (payload.files || []).map(f => ({
                    ...f,
                    id_tanda_terima_cust_item: String(nextFileId++),
                    id_tanda_terima_cust: String(nextId)
                }));

                const newItem: TandaTerimaCustItem = {
                    ...payload,
                    id_tanda_terima_cust: String(nextId++),
                    nm_customers: customer ? customer.nm_customers : 'Unknown Customer',
                    files: newFiles
                };
                mockTandaTerimaData.push(newItem);
                resolve({...newItem});
            }, 800);
        });
    },

    updateTandaTerimaCust: async (id: string, payload: Partial<TandaTerimaCustItem>): Promise<TandaTerimaCustItem> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = mockTandaTerimaData.findIndex(x => x.id_tanda_terima_cust === id);
                if (index !== -1) {
                    let updatedItem = { ...mockTandaTerimaData[index], ...payload };
                    
                    if (payload.id_customers) {
                        const customer = DUMMY_CUSTOMERS.find(c => c.id_customers === payload.id_customers);
                        if (customer) {
                            updatedItem.nm_customers = customer.nm_customers;
                        }
                    }

                    // Handle files (simple overwrite for mock)
                    if (payload.files) {
                        const newFiles = payload.files.map(f => {
                            if (!f.id_tanda_terima_cust_item) {
                                return {
                                    ...f,
                                    id_tanda_terima_cust_item: String(nextFileId++),
                                    id_tanda_terima_cust: id
                                };
                            }
                            return f;
                        });
                        updatedItem.files = newFiles;
                    }

                    mockTandaTerimaData[index] = updatedItem;
                    resolve({...updatedItem});
                } else {
                    reject(new Error('Tanda terima tidak ditemukan'));
                }
            }, 800);
        });
    },

    deleteTandaTerimaCust: async (id: string): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                mockTandaTerimaData = mockTandaTerimaData.filter(x => x.id_tanda_terima_cust !== id);
                resolve();
            }, 800);
        });
    }
};
