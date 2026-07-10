import { DUMMY_INCSHIPMENT_LIST } from '../data/dummy_incshipment';
import { IncshipmentHeader } from '../types/incshipment.types';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const incshipmentAPI = {
    fetchList: async (): Promise<IncshipmentHeader[]> => {
        await delay(800);
        return [...DUMMY_INCSHIPMENT_LIST];
    },

    fetchDetail: async (id: string): Promise<IncshipmentHeader> => {
        await delay(600);
        const item = DUMMY_INCSHIPMENT_LIST.find(i => i.id === id);
        if (!item) throw new Error('Incoming Shipment not found');
        return { ...item };
    },

    assignSerialNumber: async (id: string): Promise<IncshipmentHeader> => {
        await delay(1000);
        const index = DUMMY_INCSHIPMENT_LIST.findIndex(i => i.id === id);
        if (index === -1) throw new Error('Incoming Shipment not found');
        
        // Update dummy data globally
        DUMMY_INCSHIPMENT_LIST[index] = {
            ...DUMMY_INCSHIPMENT_LIST[index],
            f_assign_barcode: 1,
            details: DUMMY_INCSHIPMENT_LIST[index].details?.map((detail, idx) => ({
                ...detail,
                sn: `SN-GEN-${Date.now()}-${idx}`
            }))
        };
        
        return { ...DUMMY_INCSHIPMENT_LIST[index] };
    },

    printBarcode: async (id: string): Promise<IncshipmentHeader> => {
        await delay(800);
        const index = DUMMY_INCSHIPMENT_LIST.findIndex(i => i.id === id);
        if (index === -1) throw new Error('Incoming Shipment not found');
        
        // Update dummy data globally
        DUMMY_INCSHIPMENT_LIST[index] = {
            ...DUMMY_INCSHIPMENT_LIST[index],
            f_print_barcode: 1
        };
        
        return { ...DUMMY_INCSHIPMENT_LIST[index] };
    },

    receiveGoods: async (id: string, selectedItemIds: string[]): Promise<IncshipmentHeader> => {
        await delay(1200);
        const index = DUMMY_INCSHIPMENT_LIST.findIndex(i => i.id === id);
        if (index === -1) throw new Error('Incoming Shipment not found');
        
        // Ideally we only update the selected items in a real backend,
        // but for this dummy, we just set the whole header to RECEIVED
        DUMMY_INCSHIPMENT_LIST[index] = {
            ...DUMMY_INCSHIPMENT_LIST[index],
            status_incoming: 'RECEIVED',
            date_receive: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0]
        };
        
        return { ...DUMMY_INCSHIPMENT_LIST[index] };
    }
};
