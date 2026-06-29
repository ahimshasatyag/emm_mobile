import { ApprovalItemData, ApprovalItemFormData } from '../types/approvalitems.types';
import { DUMMY_APPROVAL_ITEMS } from '../data/approvalitems.dummy';

const DELAY = 1500;

let currentData = [...DUMMY_APPROVAL_ITEMS];

export const fetchApprovalItemsApi = async (): Promise<ApprovalItemData[]> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve([...currentData]), DELAY);
    });
};

export const fetchApprovalItemByIdApi = async (id: string): Promise<ApprovalItemData> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const data = currentData.find((item) => item.id === id);
            if (data) resolve({ ...data });
            else reject(new Error('Data rule persetujuan tidak ditemukan'));
        }, DELAY);
    });
};

export const createApprovalItemApi = async (data: ApprovalItemFormData): Promise<ApprovalItemData> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newId = `APP${String(currentData.length + 1).padStart(3, '0')}`;
            const newData: ApprovalItemData = {
                id: newId,
                ...data,
            };
            currentData = [newData, ...currentData];
            resolve(newData);
        }, DELAY);
    });
};

export const updateApprovalItemApi = async (id: string, data: ApprovalItemFormData): Promise<ApprovalItemData> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = currentData.findIndex(d => d.id === id);
            if (index === -1) {
                reject(new Error('Data rule persetujuan tidak ditemukan'));
                return;
            }
            
            const updated: ApprovalItemData = {
                id,
                ...data,
            };
            
            currentData[index] = updated;
            resolve(updated);
        }, DELAY);
    });
};

export const deleteApprovalItemApi = async (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const initialLength = currentData.length;
            currentData = currentData.filter(d => d.id !== id);
            
            if (currentData.length === initialLength) {
                reject(new Error('Data rule persetujuan tidak ditemukan'));
            } else {
                resolve();
            }
        }, DELAY);
    });
};
