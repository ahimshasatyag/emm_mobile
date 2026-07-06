import { SalesRetur, SalesReturListResponse, SalesReturDetailResponse } from '../types/salesretur.types';
import { dummySalesRetur, dummyCustomers, dummyDO, dummyDODetail } from '../data/dummy';

// Mocking the API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const salesReturApi = {
    // Get all sales retur
    getSalesReturs: async (): Promise<SalesReturListResponse> => {
        await delay(800);
        return { data: dummySalesRetur };
    },

    // Get specific sales retur
    getSalesReturById: async (id: string): Promise<SalesReturDetailResponse> => {
        await delay(500);
        const retur = dummySalesRetur.find(r => r.id === id);
        if (!retur) throw new Error("Sales Retur not found");
        return { data: retur };
    },

    // Get customers
    getCustomers: async () => {
        await delay(300);
        return { data: dummyCustomers };
    },

    // Get DO by customer
    getDOByCustomer: async (id_customer: string) => {
        await delay(300);
        return { data: dummyDO.filter(d => d.id_customers === id_customer) };
    },

    // Get DO details
    getDODetails: async (id_do: string) => {
        await delay(300);
        return { data: dummyDODetail[id_do as keyof typeof dummyDODetail] || [] };
    },

    // Create new sales retur
    createSalesRetur: async (data: Partial<SalesRetur>): Promise<SalesRetur> => {
        await delay(1000);
        const newRetur: SalesRetur = {
            id: String(dummySalesRetur.length + 1),
            code_sr: `SR-202310-000${dummySalesRetur.length + 1}`,
            date: data.date || new Date().toISOString().split('T')[0],
            id_customers: data.id_customers || "",
            id_do: data.id_do || "",
            keterangan: data.keterangan || "",
            status: "DRAFT",
            items: data.items || []
        };
        // In real app, we'd send to backend here
        dummySalesRetur.unshift(newRetur);
        return newRetur;
    },

    // Update existing sales retur
    updateSalesRetur: async (id: string, data: Partial<SalesRetur>): Promise<SalesRetur> => {
        await delay(1000);
        const index = dummySalesRetur.findIndex(r => r.id === id);
        if (index === -1) throw new Error("Sales Retur not found");
        
        dummySalesRetur[index] = { ...dummySalesRetur[index], ...data };
        return dummySalesRetur[index];
    },

    // Confirm sales retur
    confirmSalesRetur: async (id: string): Promise<SalesRetur> => {
        await delay(800);
        const index = dummySalesRetur.findIndex(r => r.id === id);
        if (index === -1) throw new Error("Sales Retur not found");
        
        dummySalesRetur[index].status = "CONFIRMED";
        return dummySalesRetur[index];
    },

    // Cancel sales retur
    cancelSalesRetur: async (id: string): Promise<SalesRetur> => {
        await delay(800);
        const index = dummySalesRetur.findIndex(r => r.id === id);
        if (index === -1) throw new Error("Sales Retur not found");
        
        dummySalesRetur[index].status = "CANCEL";
        return dummySalesRetur[index];
    }
};
