import { ProductPriceMktProduct, ProductPriceMktDetail, ProductPriceMktOption } from '../types/productpricemkt.types';
import api from '../../../services/api/api';

export const productPriceMktApi = {
    getProducts: async (): Promise<ProductPriceMktProduct[]> => {
        const response = await api.get(`/productpricemkt`);

        return response.data.data.map((item: any) => ({
            id_product: item.id_product,
            code_product: item.product?.code_product || '',
            nm_product: item.product?.nm_product || '',
        }));
    },

    getDetail: async (id_product: string): Promise<{ detail: ProductPriceMktDetail; options: ProductPriceMktOption[] } | null> => {
        try {
            const response = await api.get(`/productpricemkt/${id_product}`);
            const data = response.data.data;

            if (!data) return null;

            // Hitung selisih hari untuk menentukan is_recent (misalnya < 90 hari)
            let isRecent = false;
            if (data.date_create) {
                const dateObj = new Date(data.date_create);
                const diffTime = Math.abs(new Date().getTime() - dateObj.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                isRecent = diffDays <= 90;
            }

            const detail: ProductPriceMktDetail = {
                id_product: data.id_product,
                code_product: data.code_product,
                nm_product: data.nm_product,
                product_price: data.product_price ? String(data.product_price) : '0',
                product_price_agent: data.product_price_agent ? String(data.product_price_agent) : '0',
                date_update: data.date_create,
                kurs_bank: data.kurs_bank ? String(data.kurs_bank) : '0',
                estimasi: data.estimasi ? String(data.estimasi) : '0',
                link_brosur: data.link_brosur || null,
                is_recent: isRecent,
            };

            const options: ProductPriceMktOption[] = (data.data_options || []).map((opt: any) => ({
                nm_product_opt: opt.nm_product_opt,
                amount: opt.amount ? String(opt.amount) : '0',
                kurs: opt.kurs ? String(opt.kurs) : '0',
                estimasi: opt.estimasi ? String(opt.estimasi) : '0',
            }));

            return { detail, options };
        } catch (error) {
            console.error("Error fetching detail:", error);
            return null;
        }
    }
};
