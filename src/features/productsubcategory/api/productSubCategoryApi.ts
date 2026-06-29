import { ProductSubCategoryData, ProductSubCategoryFormData } from '../types/productsubcategory.types';
import { productSubCategoryDummyData } from '../data/productSubCategoryDummy.data';
import { productCategoryDummyData } from '../../productcategory/data/productCategoryDummy.data';

// Mock API with artificial delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let mockData = [...productSubCategoryDummyData];

export const productSubCategoryApi = {
    fetchSubCategories: async (): Promise<ProductSubCategoryData[]> => {
        await delay(800);
        return [...mockData];
    },

    createSubCategory: async (data: ProductSubCategoryFormData): Promise<ProductSubCategoryData> => {
        await delay(1000);
        
        const category = productCategoryDummyData.find(c => c.id_product_kategori === data.id_product_kategori);
        
        const newSubCategory: ProductSubCategoryData = {
            id_product_sub_kategori: `SUB-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
            kode_product_sub_kategori: `${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
            id_product_kategori: data.id_product_kategori,
            nm_product_kategori: category ? category.nm_product_kategori : 'Unknown',
            nm_product_sub_kategori: data.nm_product_sub_kategori,
        };
        
        mockData = [newSubCategory, ...mockData];
        return newSubCategory;
    },

    updateSubCategory: async (id: string, data: Partial<ProductSubCategoryFormData>): Promise<ProductSubCategoryData> => {
        await delay(1000);
        const index = mockData.findIndex(c => c.id_product_sub_kategori === id);
        if (index === -1) throw new Error('Sub Kategori tidak ditemukan');
        
        let nm_product_kategori = mockData[index].nm_product_kategori;
        if (data.id_product_kategori) {
            const category = productCategoryDummyData.find(c => c.id_product_kategori === data.id_product_kategori);
            if (category) {
                nm_product_kategori = category.nm_product_kategori;
            }
        }

        const updatedSubCategory = { ...mockData[index], ...data, nm_product_kategori };
        mockData[index] = updatedSubCategory;
        return updatedSubCategory;
    },

    deleteSubCategory: async (id: string): Promise<void> => {
        await delay(800);
        mockData = mockData.filter(c => c.id_product_sub_kategori !== id);
    }
};
