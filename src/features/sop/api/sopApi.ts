import { dummyDivisions, dummySops } from '../data/dummySop';
import { DivisionSopSummary, SopItem } from '../types/sop.types';

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
        dummySops.push(newSop);
        
        // Update division summary count
        const divIndex = dummyDivisions.findIndex(d => d.divisi === payload.divisi);
        if (divIndex !== -1) {
            dummyDivisions[divIndex].total += 1;
        }

        return newSop;
    },

    updateSop: async (id: string, payload: Partial<SopItem>): Promise<SopItem> => {
        await delay(800);
        const index = dummySops.findIndex(sop => sop.id_sop === id);
        if (index === -1) throw new Error("SOP not found");
        
        dummySops[index] = { ...dummySops[index], ...payload };
        return dummySops[index];
    },

    confirmSop: async (id: string): Promise<SopItem> => {
        await delay(800);
        const index = dummySops.findIndex(sop => sop.id_sop === id);
        if (index === -1) throw new Error("SOP not found");

        dummySops[index].status = 'FINALIZE';
        return dummySops[index];
    },

    revisiSop: async (id: string): Promise<SopItem> => {
        await delay(800);
        const index = dummySops.findIndex(sop => sop.id_sop === id);
        if (index === -1) throw new Error("SOP not found");

        const currentSop = dummySops[index];
        
        // Add to history
        currentSop.history.push({
            id: Math.random().toString(36).substr(2, 9),
            file_pdf: currentSop.file_pdf,
            date_update: new Date().toISOString()
        });

        currentSop.status = 'IN PROGRESS';
        return currentSop;
    }
};
