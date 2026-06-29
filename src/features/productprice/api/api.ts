import { ProductPrice, ProductPriceFormData } from '../types/productprice.types';
import { dummyProductPrices } from '../data/dummy';

// Simulasi delay jaringan
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let currentPrices = [...dummyProductPrices];

export const productPriceApi = {
    getAll: async (): Promise<ProductPrice[]> => {
        await delay(800);
        return [...currentPrices];
    },

    getById: async (id: string): Promise<ProductPrice | null> => {
        await delay(500);
        const price = currentPrices.find(p => p.id_product === id);
        return price ? { ...price } : null;
    },

    create: async (data: ProductPriceFormData): Promise<ProductPrice> => {
        await delay(800);
        // Simulasi pembuatan product price
        // Di sistem nyata, data produk (nama, brand) ditarik dari id_product
        const newPrice: ProductPrice = {
            id_product: data.id_product,
            code_product: `P${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
            nm_product: 'Produk Baru ' + data.id_product,
            nm_product_brand: 'Brand Baru',
            product_price: data.product_price,
            product_price_agent: data.product_price_agent,
            waktu: new Date().toISOString(),
            aksi: 'NEW',
            flag_active: 't',
            kurs: '15000',
            est_idr: data.product_price
        };
        currentPrices.unshift(newPrice);
        return newPrice;
    },

    update: async (id: string, data: ProductPriceFormData): Promise<ProductPrice> => {
        await delay(800);
        const index = currentPrices.findIndex(p => p.id_product === id);
        if (index === -1) throw new Error('Harga produk tidak ditemukan');
        
        const updatedPrice = {
            ...currentPrices[index],
            product_price: data.product_price,
            product_price_agent: data.product_price_agent,
            waktu: new Date().toISOString(),
            aksi: 'UPDATE'
        };
        
        currentPrices[index] = updatedPrice;
        return updatedPrice;
    },

    delete: async (id: string): Promise<void> => {
        await delay(500);
        currentPrices = currentPrices.filter(p => p.id_product !== id);
    }
};
