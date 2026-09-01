import { ProductPriceAgentProduct, ProductPriceAgentDetail, ProductPriceAgentOptions } from '../types/productpriceagent.types';
import api from '../../../services/api/api';

export const productPriceAgentApi = {
    getProducts: async (): Promise<{ status: boolean; data: ProductPriceAgentProduct[] }> => {
        try {
            const response = await api.get('/productpriceagent');
            const products = response.data.data.map((item: any) => ({
                id_product: item.id_product,
                code_product: item.product?.code_product || '',
                nm_product: item.product?.nm_product || '',
            }));
            
            return {
                status: true,
                data: products
            };
        } catch (error) {
            console.error("Error fetching agent products:", error);
            throw error;
        }
    },
    
    getProductDetail: async (id_product: string): Promise<{ status: boolean; data: ProductPriceAgentDetail | null; options?: ProductPriceAgentOptions | null }> => {
        try {
            const response = await api.get(`/productpriceagent/${id_product}`);
            const data = response.data.data;
            
            if (!data) {
                return { status: false, data: null };
            }

            // Calculate is_recent based on date_create
            let isRecent = false;
            if (data.date_create) {
                const dateObj = new Date(data.date_create);
                const diffTime = Math.abs(new Date().getTime() - dateObj.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                isRecent = diffDays <= 90;
            }

            const detail: ProductPriceAgentDetail = {
                id_product: data.id_product,
                code_product: data.code_product,
                nm_product: data.nm_product,
                product_price_agent: data.product_price_agent ? Number(data.product_price_agent) : 0,
                date_update: data.date_create,
                kurs_bank: data.kurs_bank ? Number(data.kurs_bank) : 0,
                estimasi: data.estimasi ? Number(data.estimasi) : 0,
                link_brosur: data.link_brosur || undefined,
            };

            return {
                status: true,
                data: detail,
                options: null
            };
        } catch (error) {
            console.error("Error fetching agent product detail:", error);
            return { status: false, data: null, options: null };
        }
    },

    tambahKeranjang: async (id_product: string, qty: number = 1): Promise<any> => {
        try {
            const response = await api.post(`/productpriceagent/keranjang`, { id_product, qty });
            return response.data;
        } catch (error) {
            console.error("Error adding agent product to cart:", error);
            throw error;
        }
    }
};
