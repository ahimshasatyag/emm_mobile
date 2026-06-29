import { InventoryTypeData, InventoryTypeFormData } from '../types/inventorytype.types';
import { DUMMY_INVENTORY_TYPES } from '../data/inventorytype.dummy';

const DELAY = 1500;

let currentData = [...DUMMY_INVENTORY_TYPES];

export const fetchInventoryTypeApi = async (): Promise<InventoryTypeData[]> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve([...currentData]), DELAY);
    });
};

export const fetchInventoryTypeByIdApi = async (id: string): Promise<InventoryTypeData> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const data = currentData.find((item) => item.id === id);
            if (data) resolve({ ...data });
            else reject(new Error('Data tipe inventori tidak ditemukan'));
        }, DELAY);
    });
};

export const createInventoryTypeApi = async (data: InventoryTypeFormData): Promise<InventoryTypeData> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulate auto-generated ID (Kode Type)
            const newId = `TYP${String(currentData.length + 1).padStart(3, '0')}`;
            const newData: InventoryTypeData = {
                id: newId,
                name: data.name,
            };
            currentData = [newData, ...currentData];
            resolve(newData);
        }, DELAY);
    });
};

export const updateInventoryTypeApi = async (id: string, data: InventoryTypeFormData): Promise<InventoryTypeData> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = currentData.findIndex(d => d.id === id);
            if (index === -1) {
                reject(new Error('Data tipe inventori tidak ditemukan'));
                return;
            }
            
            const updated: InventoryTypeData = {
                id,
                name: data.name,
            };
            
            currentData[index] = updated;
            resolve(updated);
        }, DELAY);
    });
};

export const deleteInventoryTypeApi = async (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const initialLength = currentData.length;
            currentData = currentData.filter(d => d.id !== id);
            
            if (currentData.length === initialLength) {
                reject(new Error('Data tipe inventori tidak ditemukan'));
            } else {
                resolve();
            }
        }, DELAY);
    });
};
