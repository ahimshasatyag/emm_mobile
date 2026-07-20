import { MataUangResponse } from '../types/matauang.types';
import { CLEAN_DUMMY_MATAUANG } from '../data/dummy';

export const fetchMataUang = async (): Promise<MataUangResponse> => {
    // Simulate network delay
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                status: true,
                data: CLEAN_DUMMY_MATAUANG
            });
        }, 1000);
    });
};
