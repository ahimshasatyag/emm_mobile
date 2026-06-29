import { CounterData, CounterFormData } from '../types/counter.types';
import { DUMMY_COUNTERS } from '../data/counter.dummy';

const DELAY = 1500;

let currentData = [...DUMMY_COUNTERS];

export const fetchCountersApi = async (): Promise<CounterData[]> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve([...currentData]), DELAY);
    });
};

export const fetchCounterByIdApi = async (id: string): Promise<CounterData> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const data = currentData.find((item) => item.id_counter === id);
            if (data) resolve({ ...data });
            else reject(new Error('Data counter tidak ditemukan'));
        }, DELAY);
    });
};

export const updateCounterApi = async (id: string, data: CounterFormData): Promise<CounterData> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = currentData.findIndex(d => d.id_counter === id);
            if (index === -1) {
                reject(new Error('Data counter tidak ditemukan'));
                return;
            }
            
            const updated: CounterData = {
                ...currentData[index],
                no_counter: Number(data.no_counter) || 0,
            };
            
            currentData[index] = updated;
            resolve(updated);
        }, DELAY);
    });
};

export const deleteCounterApi = async (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const initialLength = currentData.length;
            currentData = currentData.filter(d => d.id_counter !== id);
            
            if (currentData.length === initialLength) {
                reject(new Error('Data counter tidak ditemukan'));
            } else {
                resolve();
            }
        }, DELAY);
    });
};
