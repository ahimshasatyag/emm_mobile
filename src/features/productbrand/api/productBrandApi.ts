import { ProductBrand, ProductBrandFormData } from '../types/productbrand.types';
import { productBrandDummyData } from '../data/productBrandDummy.data';

let dummyData = [...productBrandDummyData];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const productBrandApi = {
    getAll: async (): Promise<ProductBrand[]> => {
        await delay(1500); // Simulate network delay
        return [...dummyData];
    },

    create: async (data: ProductBrandFormData): Promise<ProductBrand> => {
        await delay(1000);
        const newBrand: ProductBrand = {
            id_product_brand: `BRD${String(dummyData.length + 1).padStart(3, '0')}`,
            nm_product_brand: data.nm_product_brand
        };
        dummyData.push(newBrand);
        return newBrand;
    },

    update: async (id: string, data: Partial<ProductBrandFormData>): Promise<ProductBrand> => {
        await delay(1000);
        const index = dummyData.findIndex(item => item.id_product_brand === id);
        if (index === -1) throw new Error('Brand tidak ditemukan');

        dummyData[index] = { ...dummyData[index], ...data };
        return dummyData[index];
    },

    delete: async (id: string): Promise<void> => {
        await delay(1000);
        const index = dummyData.findIndex(item => item.id_product_brand === id);
        if (index === -1) throw new Error('Brand tidak ditemukan');

        dummyData = dummyData.filter(item => item.id_product_brand !== id);
    }
};
