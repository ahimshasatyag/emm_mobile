import { KasBankInHeader, KasBankInDetail, Bank, Coa, SalesOrder } from '../types/kasbankin.types';
import { mockKasBankIns, mockKasBankInDetails, mockBanks, mockCoas, mockSalesOrders } from '../data/mockData';

export const kasbankinApi = {
    fetchKasBankInList: async (): Promise<KasBankInHeader[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([...mockKasBankIns]);
            }, 500);
        });
    },

    fetchKasBankInById: async (id: string): Promise<{ header: KasBankInHeader, details: KasBankInDetail[] }> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const header = mockKasBankIns.find(k => k.id_kb_masuk === id);
                if (header) {
                    const details = mockKasBankInDetails.filter(d => d.id_kb_masuk === id);
                    resolve({ header, details });
                } else {
                    reject(new Error('Kas Bank In not found'));
                }
            }, 500);
        });
    },

    saveKasBankIn: async (data: { header: Partial<KasBankInHeader>, details: Partial<KasBankInDetail>[] }): Promise<KasBankInHeader> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newId = `KB${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
                
                // Get relations for mock list display
                const bank = mockBanks.find(b => b.id_bank === data.header.id_bank);
                const so = mockSalesOrders.find(s => s.id_so === data.header.id_so);

                const newHeader: KasBankInHeader = {
                    ...data.header,
                    id_kb_masuk: newId,
                    code_kb_masuk: data.header.code_kb_masuk || `MOCK-${newId}`,
                    type_kb: data.header.type_kb || 'k',
                    id_bank: data.header.id_bank || '',
                    d_bank: data.header.d_bank || new Date().toISOString().split('T')[0],
                    v_amount: data.header.v_amount || 0,
                    v_balance: data.header.v_amount || 0,
                    f_dp: data.header.f_dp || false,
                    id_so: data.header.id_so || null,
                    deskripsi: data.header.deskripsi || '',
                    date_create: new Date().toISOString(),
                    nm_bank: bank?.nm_bank,
                    code_so: so?.code_so,
                    nm_customers: so?.nm_customers,
                };
                
                mockKasBankIns.push(newHeader);

                data.details.forEach((d, index) => {
                    const coa = mockCoas.find(c => c.id_coa === d.id_coa);
                    mockKasBankInDetails.push({
                        id_kb_masuk_dtl: `KBD${newId}-${index}`,
                        id_kb_masuk: newId,
                        id_coa: d.id_coa || '',
                        v_amount: d.v_amount || 0,
                        deskripsi: d.deskripsi || '',
                        coa_name: coa?.coa_name || '',
                    });
                });

                resolve(newHeader);
            }, 800);
        });
    },

    fetchBanks: async (): Promise<Bank[]> => {
        return new Promise((resolve) => setTimeout(() => resolve(mockBanks), 300));
    },

    fetchCoas: async (): Promise<Coa[]> => {
        return new Promise((resolve) => setTimeout(() => resolve(mockCoas), 300));
    },

    fetchSalesOrders: async (): Promise<SalesOrder[]> => {
        return new Promise((resolve) => setTimeout(() => resolve(mockSalesOrders), 300));
    },

    fetchSoDetail: async (id_so: string): Promise<SalesOrder | undefined> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const so = mockSalesOrders.find(s => s.id_so === id_so);
                resolve(so);
            }, 300);
        });
    }
};
