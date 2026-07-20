import { AssetItem, InventorySchedule, UserItem } from '../types/inventoryschedule.types';
import { DUMMY_ASSETS, DUMMY_SCHEDULES, DUMMY_USERS } from '../data/dummy';

export const fetchSchedules = async (): Promise<InventorySchedule[]> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(DUMMY_SCHEDULES), 800);
    });
};

export const fetchScheduleById = async (id: string): Promise<InventorySchedule | undefined> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const schedule = DUMMY_SCHEDULES.find((s) => s.id === id);
            resolve(schedule);
        }, 500);
    });
};

export const fetchAssets = async (): Promise<AssetItem[]> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(DUMMY_ASSETS), 300);
    });
};

export const fetchUsers = async (): Promise<UserItem[]> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(DUMMY_USERS), 300);
    });
};

export const saveSchedule = async (schedule: Partial<InventorySchedule>): Promise<InventorySchedule> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newSchedule = { ...schedule, id: Date.now().toString() } as InventorySchedule;
            resolve(newSchedule);
        }, 1000);
    });
};

export const updateSchedule = async (id: string, schedule: Partial<InventorySchedule>): Promise<InventorySchedule> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const updatedSchedule = { ...schedule, id } as InventorySchedule;
            resolve(updatedSchedule);
        }, 1000);
    });
};
