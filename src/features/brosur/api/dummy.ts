import { BrosurProduct } from '../types/brosur.types';
import { DUMMY_BROSUR_PRODUCTS } from '../data/dummyBrosur';

export const dummyApi = {
    getBrosurProducts: async (): Promise<BrosurProduct[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Hanya mengembalikan yang ada link brosurnya
                const filtered = DUMMY_BROSUR_PRODUCTS.filter(p => p.link_brosur !== null);
                resolve(filtered);
            }, 800); // Simulasi delay jaringan
        });
    },

    generateBrosur: async (productIds: string[], withCover: boolean): Promise<{ success: boolean, url: string }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const idString = productIds.join('-');
                const coverFlag = withCover ? '1' : '0';
                resolve({
                    success: true,
                    url: `https://dummy-brosur-api.com/brosur/cform/generate/${idString}/${coverFlag}`
                });
            }, 1000);
        });
    }
};
