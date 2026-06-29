import { ProductCategoryData, ProductCategoryFormData } from '../types/productcategory.types';
import { initialDummyProductCategories } from '../data/productCategoryDummy.data';

let dummyCategories: ProductCategoryData[] = [...initialDummyProductCategories];

export const productCategoryApi = {
    fetchCategories: async (): Promise<ProductCategoryData[]> => {
        return new Promise((resolve) => setTimeout(() => resolve([...dummyCategories]), 600));
    },

    fetchCategoryById: async (id: string): Promise<ProductCategoryData> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const category = dummyCategories.find(c => c.id_product_kategori === id);
                if (category) resolve(category);
                else reject(new Error('Category not found'));
            }, 500);
        });
    },

    createCategory: async (data: ProductCategoryFormData): Promise<ProductCategoryData> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const nextIdNum = dummyCategories.length + 1;
                const newCategory: ProductCategoryData = {
                    ...data,
                    id_product_kategori: `KAT-${nextIdNum < 10 ? '0' + nextIdNum : nextIdNum}`,
                    kode_product_kategori: `${nextIdNum < 100 ? '0' : ''}${nextIdNum < 10 ? '0' + nextIdNum : nextIdNum}`,
                    f_status: 't'
                };
                dummyCategories.push(newCategory);
                resolve(newCategory);
            }, 800);
        });
    },

    updateCategory: async (id: string, data: Partial<ProductCategoryFormData>): Promise<ProductCategoryData> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = dummyCategories.findIndex(c => c.id_product_kategori === id);
                if (index > -1) {
                    dummyCategories[index] = { ...dummyCategories[index], ...data } as ProductCategoryData;
                    resolve(dummyCategories[index]);
                } else {
                    reject(new Error('Category not found'));
                }
            }, 800);
        });
    },

    deleteCategory: async (id: string): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                dummyCategories = dummyCategories.filter(c => c.id_product_kategori !== id);
                resolve();
            }, 600);
        });
    }
};
