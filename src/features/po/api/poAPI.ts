import { DUMMY_PO_LIST } from "../data/dummy_po";
import { PoHeader } from "../types/po.types";

export const poAPI = {
    fetchPoList: async (): Promise<PoHeader[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(DUMMY_PO_LIST);
            }, 800);
        });
    },

    fetchPoDetail: async (id_po: string): Promise<PoHeader | null> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const detail = DUMMY_PO_LIST.find(p => p.id_po === id_po);
                resolve(detail || null);
            }, 800);
        });
    },

    savePo: async (data: any): Promise<any> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, message: "Berhasil menyimpan PO" });
            }, 1000);
        });
    }
};
