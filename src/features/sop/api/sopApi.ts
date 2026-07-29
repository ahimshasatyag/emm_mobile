import { dummyDivisions as initialDivisions, dummySops as initialSops } from '../data/dummySop';
import { DivisionSopSummary, SopItem } from '../types/sop.types';

let dummyDivisions: DivisionSopSummary[] = JSON.parse(JSON.stringify(initialDivisions));
let dummySops: SopItem[] = JSON.parse(JSON.stringify(initialSops));

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const sopApi = {
    fetchDivisions: async (): Promise<DivisionSopSummary[]> => {
        await delay(500);
        return [...dummyDivisions];
    },

    fetchSopsByDivisi: async (divisi: string): Promise<SopItem[]> => {
        await delay(500);
        return dummySops.filter(sop => sop.divisi === divisi);
    },

    fetchSopById: async (id: string): Promise<SopItem | undefined> => {
        await delay(500);
        return dummySops.find(sop => sop.id_sop === id);
    },

    addSop: async (payload: Omit<SopItem, 'id_sop' | 'status' | 'history' | 'date_create'>): Promise<SopItem> => {
        await delay(800);
        const newSop: SopItem = {
            ...payload,
            id_sop: Math.random().toString(36).substr(2, 9),
            status: 'DRAFT',
            history: [],
            date_create: new Date().toISOString(),
        };
        
        dummySops = [...dummySops, newSop];
        
        dummyDivisions = dummyDivisions.map(d => 
            d.divisi === payload.divisi 
                ? { ...d, total: d.total + 1 }
                : d
        );

        return newSop;
    },

    updateSop: async (id: string, payload: Partial<SopItem>): Promise<SopItem> => {
        await delay(800);
        
        const exists = dummySops.some(sop => sop.id_sop === id);
        if (!exists) throw new Error("SOP not found");

        dummySops = dummySops.map(sop => sop.id_sop === id ? { ...sop, ...payload } : sop);
        return dummySops.find(sop => sop.id_sop === id)!;
    },

    confirmSop: async (id: string): Promise<SopItem> => {
        await delay(800);
        
        const exists = dummySops.some(sop => sop.id_sop === id);
        if (!exists) throw new Error("SOP not found");

        dummySops = dummySops.map(sop => sop.id_sop === id ? { ...sop, status: 'FINALIZE' } : sop);
        return dummySops.find(sop => sop.id_sop === id)!;
    },

    revisiSop: async (id: string): Promise<SopItem> => {
        await delay(800);
        
        const exists = dummySops.some(sop => sop.id_sop === id);
        if (!exists) throw new Error("SOP not found");

        dummySops = dummySops.map(sop => {
            if (sop.id_sop === id) {
                return {
                    ...sop,
                    status: 'IN PROGRESS',
                    history: [
                        ...sop.history,
                        {
                            id: Math.random().toString(36).substr(2, 9),
                            file_pdf: sop.file_pdf,
                            date_update: new Date().toISOString()
                        }
                    ]
                };
            }
            return sop;
        });
        
        return dummySops.find(sop => sop.id_sop === id)!;
    }
};
