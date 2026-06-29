import { SettingData, SettingFormData } from '../types/setting.types';
import { DUMMY_SETTINGS } from '../data/setting.dummy';

const DELAY = 1500;

let currentData = [...DUMMY_SETTINGS];

export const fetchSettingsApi = async (): Promise<SettingData[]> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve([...currentData]), DELAY);
    });
};

export const fetchSettingByIdApi = async (id: string): Promise<SettingData> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const data = currentData.find((item) => item.setting_id === id);
            if (data) resolve({ ...data });
            else reject(new Error('Data setting tidak ditemukan'));
        }, DELAY);
    });
};

export const createSettingApi = async (data: SettingFormData): Promise<SettingData> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Check for duplicate key (mimicking PHP cek_data)
            if (currentData.some(d => d.setting_key === data.setting_key)) {
                reject(new Error('Key Sudah Terdaftar'));
                return;
            }

            const newId = String(Date.now());
            const newData: SettingData = {
                setting_id: newId,
                ...data
            };
            currentData = [newData, ...currentData];
            resolve(newData);
        }, DELAY);
    });
};

export const updateSettingApi = async (id: string, data: SettingFormData): Promise<SettingData> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = currentData.findIndex(d => d.setting_id === id);
            if (index === -1) {
                reject(new Error('Data setting tidak ditemukan'));
                return;
            }
            
            // Note: Cform PHP update doesn't check key duplicate on update but it's good practice.
            // We assume the user cannot change the key or if they do it's checked.
            
            const updated: SettingData = {
                ...currentData[index],
                ...data
            };
            
            currentData[index] = updated;
            resolve(updated);
        }, DELAY);
    });
};

export const deleteSettingApi = async (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const initialLength = currentData.length;
            currentData = currentData.filter(d => d.setting_id !== id);
            
            if (currentData.length === initialLength) {
                reject(new Error('Data setting tidak ditemukan'));
            } else {
                resolve();
            }
        }, DELAY);
    });
};
