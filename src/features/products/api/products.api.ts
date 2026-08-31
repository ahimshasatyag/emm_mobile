import { ProductData, CategoryOption, SubCategoryOption, BrandOption, SatuanOption, ProductFormData } from '../types/products.types';
import api from '../../../services/api/api';

export const productsApi = {
    fetchProducts: async (): Promise<ProductData[]> => {
        try {
            const response = await api.get('/product');
            return response.data.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Gagal mengambil data produk');
        }
    },

    fetchProductById: async (id: string): Promise<ProductData> => {
        try {
            const response = await api.get(`/product/${id}`);
            return response.data.data.product;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Product not found');
        }
    },

    createProduct: async (data: ProductFormData): Promise<ProductData> => {
        try {
            // Count options for backend format if necessary
            const payload = {
                ...data,
                jml: data.options?.length || 0
            };
            const response = await api.post('/product', payload);
            return response.data.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to create product');
        }
    },

    updateProduct: async (id: string, data: Partial<ProductFormData>): Promise<ProductData> => {
        try {
            const payload = {
                ...data,
                jml: data.options?.length || 0
            };
            // Backend uses POST method for update because of multipart/form-data constraints
            const response = await api.post(`/product/${id}`, payload);
            return response.data.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to update product');
        }
    },

    deleteProduct: async (id: string): Promise<void> => {
        try {
            await api.delete(`/product/${id}`);
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to delete product');
        }
    },

    // Dropdown Options
    fetchCategories: async (): Promise<CategoryOption[]> => {
        try {
            const response = await api.get('/product/support-data');
            return (response.data.data.data_kategori || []).map((c: any) => ({
                ...c,
                id_product_kategori: c.id_product_kategori?.toString()
            }));
        } catch (error: any) {
            return [];
        }
    },

    fetchSubCategories: async (categoryId: string): Promise<SubCategoryOption[]> => {
        try {
            const response = await api.get(`/product/sub-kategori?id_product_kategori=${categoryId}`);
            return (response.data.data || []).map((c: any) => ({
                ...c,
                id_product_sub_kategori: c.id_product_sub_kategori?.toString()
            }));
        } catch (error: any) {
            return [];
        }
    },

    fetchBrands: async (): Promise<BrandOption[]> => {
        try {
            const response = await api.get('/product/support-data');
            return (response.data.data.data_brand || []).map((b: any) => ({
                ...b,
                id_product_brand: b.id_product_brand?.toString()
            }));
        } catch (error: any) {
            return [];
        }
    },

    fetchSatuans: async (): Promise<SatuanOption[]> => {
        try {
            const response = await api.get('/product/support-data');
            return (response.data.data.data_satuan || []).map((s: any) => ({
                ...s,
                id_product_satuan: s.id_product_satuan?.toString()
            }));
        } catch (error: any) {
            return [];
        }
    }
};
