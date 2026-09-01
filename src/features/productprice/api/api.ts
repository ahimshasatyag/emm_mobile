import { ProductPrice, ProductPriceFormData, ProductPriceSupportData } from '../types/productprice.types';
import { api } from '../../../services/api/api';

export const productPriceApi = {
    getAll: async (): Promise<ProductPrice[]> => {
        const response = await api.get('/productprice');

        const result = response.data.data;

        return result.map((item: any) => ({
            ...item,
            code_product: item.product?.code_product || item.code_product || '-',
            nm_product: item.product?.nm_product || item.nm_product || 'Produk Tidak Ditemukan',
            nm_product_brand: item.product?.brand?.nm_product_brand || item.nm_product_brand || '-',
            waktu: item.date_update || item.date_create,
            kurs: item.kurs_bank,
            est_idr: (parseFloat(item.product_price || 0) * parseFloat(item.kurs_bank || 0)).toString(),
            history: item.history || [],
            options: item.options || [],
        }));
    },

    getSupportData: async (): Promise<ProductPriceSupportData> => {
        const response = await api.get('/productprice/support-data');
        return response.data.data;
    },

    getById: async (id: string): Promise<ProductPrice> => {
        const response = await api.get(`/productprice/${id}`);
        const item = response.data.data;
        return {
            ...item,
            code_product: item.product?.code_product || item.code_product || '-',
            nm_product: item.product?.nm_product || item.nm_product || 'Produk Tidak Ditemukan',
            nm_product_brand: item.product?.brand?.nm_product_brand || item.nm_product_brand || '-',
            waktu: item.date_update || item.date_create,
            kurs: item.kurs_bank,
            est_idr: (parseFloat(item.product_price || 0) * parseFloat(item.kurs_bank || 0)).toString(),
            history: item.history || [],
            options: item.options || [],
        };
    },

    create: async (data: ProductPriceFormData): Promise<ProductPrice> => {
        const response = await api.post('/productprice', data);
        const item = response.data.data;

        return item;
    },

    update: async (id: string, data: ProductPriceFormData): Promise<ProductPrice> => {
        const response = await api.put(`/productprice/${id}`, data);
        return response.data.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/productprice/${id}`);
    }
};
