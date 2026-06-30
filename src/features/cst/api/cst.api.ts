import { Cst, CstDetail } from '../types/cst.types';
import { dummyCstList, dummyCstDetail } from '../data/cst.dummy';

export const fetchCstList = async (): Promise<Cst[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([...dummyCstList]);
        }, 800);
    });
};

export const fetchCstDetail = async (cst_code: string): Promise<CstDetail> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const detail = dummyCstDetail[cst_code];
            if (detail) {
                resolve(detail);
            } else {
                reject(new Error('CST Detail not found'));
            }
        }, 800);
    });
};

export const closeCst = async (cst_code: string): Promise<boolean> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`CST ${cst_code} closed (DONE)`);
            resolve(true);
        }, 1000);
    });
};

export const cancelCst = async (cst_code: string): Promise<boolean> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`CST ${cst_code} CANCELLED`);
            resolve(true);
        }, 1000);
    });
};
