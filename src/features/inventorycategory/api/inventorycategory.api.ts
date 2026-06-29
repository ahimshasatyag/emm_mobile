import { InventoryCategoryData, InventoryCategoryFormData } from '../types/inventorycategory.types';
import { DUMMY_INVENTORY_CATEGORIES } from '../data/inventorycategory.dummy';

const DELAY = 1500;

let currentData = [...DUMMY_INVENTORY_CATEGORIES];

export const fetchInventoryCategoryApi = async (): Promise<InventoryCategoryData[]> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve([...currentData]), DELAY);
    });
};

export const fetchInventoryCategoryByIdApi = async (id: string): Promise<InventoryCategoryData> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const data = currentData.find((item) => item.id === id);
            if (data) resolve({ ...data });
            else reject(new Error('Data kategori tidak ditemukan'));
        }, DELAY);
    });
};

export const createInventoryCategoryApi = async (data: InventoryCategoryFormData): Promise<InventoryCategoryData> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulate auto-generated ID (Kode Category)
            const newId = `CAT${String(currentData.length + 1).padStart(3, '0')}`;
            const newData: InventoryCategoryData = {
                id: newId,
                name: data.name,
            };
            currentData = [newData, ...currentData];
            resolve(newData);
        }, DELAY);
    });
};

export const updateInventoryCategoryApi = async (id: string, data: InventoryCategoryFormData): Promise<InventoryCategoryData> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = currentData.findIndex(d => d.id === id);
            if (index === -1) {
                reject(new Error('Data kategori tidak ditemukan'));
                return;
            }
            
            const updated: InventoryCategoryData = {
                id,
                name: data.name,
            };
            
            currentData[index] = updated;
            resolve(updated);
        }, DELAY);
    });
};

export const deleteInventoryCategoryApi = async (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const initialLength = currentData.length;
            currentData = currentData.filter(d => d.id !== id);
            
            if (currentData.length === initialLength) {
                reject(new Error('Data kategori tidak ditemukan'));
            } else {
                resolve();
            }
        }, DELAY);
    });
};
