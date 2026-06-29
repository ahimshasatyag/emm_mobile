import { UsersLogData } from '../types/userslog.types';
import { mockUsersLog } from '../data/userslog.dummy';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchUsersLogApi = async (): Promise<UsersLogData[]> => {
    await delay(1200); // Simulate network latency
    return [...mockUsersLog];
};
