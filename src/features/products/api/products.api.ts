import { ProductData, CategoryOption, SubCategoryOption, BrandOption, SatuanOption, ProductFormData } from '../types/products.types';

import { initialDummyProducts } from '../data/productsDummy.data';

let dummyProducts: ProductData[] = [...initialDummyProducts];

export const productsApi = {
    fetchProducts: async (): Promise<ProductData[]> => {
        return new Promise((resolve) => setTimeout(() => resolve([...dummyProducts]), 600));
    },

    fetchProductById: async (id: string): Promise<ProductData> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const product = dummyProducts.find(p => p.id_product === id);
                if (product) resolve(product);
                else reject(new Error('Product not found'));
            }, 500);
        });
    },

    createProduct: async (data: ProductFormData): Promise<ProductData> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newProduct: ProductData = {
                    ...data,
                    id_product: Math.random().toString(36).substr(2, 9),
                    nm_product_kategori: 'Kategori Dummy',
                    nm_product_brand: 'Brand Dummy',
                    nm_product_satuan: 'Satuan Dummy',
                };
                dummyProducts.push(newProduct);
                resolve(newProduct);
            }, 800);
        });
    },

    updateProduct: async (id: string, data: Partial<ProductFormData>): Promise<ProductData> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = dummyProducts.findIndex(p => p.id_product === id);
                if (index > -1) {
                    dummyProducts[index] = { ...dummyProducts[index], ...data } as ProductData;
                    resolve(dummyProducts[index]);
                } else {
                    reject(new Error('Product not found'));
                }
            }, 800);
        });
    },

    deleteProduct: async (id: string): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                dummyProducts = dummyProducts.filter(p => p.id_product !== id);
                resolve();
            }, 600);
        });
    },

    // Dropdown Options
    fetchCategories: async (): Promise<CategoryOption[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    { id_product_kategori: 'KAT-01', nm_product_kategori: 'Elektronik' },
                    { id_product_kategori: 'KAT-02', nm_product_kategori: 'Pakaian' },
                ]);
            }, 300);
        });
    },

    fetchSubCategories: async (categoryId: string): Promise<SubCategoryOption[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (categoryId === 'KAT-01') {
                    resolve([
                        { id_product_sub_kategori: 'SUB-01', nm_product_sub_kategori: 'Laptop' },
                        { id_product_sub_kategori: 'SUB-02', nm_product_sub_kategori: 'Handphone' },
                    ]);
                } else if (categoryId === 'KAT-02') {
                    resolve([
                        { id_product_sub_kategori: 'SUB-03', nm_product_sub_kategori: 'Baju' },
                        { id_product_sub_kategori: 'SUB-04', nm_product_sub_kategori: 'Celana' },
                    ]);
                } else {
                    resolve([]);
                }
            }, 300);
        });
    },

    fetchBrands: async (): Promise<BrandOption[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    { id_product_brand: 'BRD-01', nm_product_brand: 'Asus' },
                    { id_product_brand: 'BRD-02', nm_product_brand: 'Samsung' },
                    { id_product_brand: 'BRD-03', nm_product_brand: 'Apple' },
                ]);
            }, 300);
        });
    },

    fetchSatuans: async (): Promise<SatuanOption[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    { id_product_satuan: 'SAT-01', nm_product_satuan: 'Pcs' },
                    { id_product_satuan: 'SAT-02', nm_product_satuan: 'Box' },
                    { id_product_satuan: 'SAT-03', nm_product_satuan: 'Lusin' },
                ]);
            }, 300);
        });
    }
};
