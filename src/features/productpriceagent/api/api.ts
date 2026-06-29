import { dummyProducts, dummyDetails, dummyOptions } from '../data/dummy';

export const productPriceAgentApi = {
    getProducts: async () => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        return {
            status: true,
            data: dummyProducts
        };
    },
    
    getProductDetail: async (id_product: string) => {
        await new Promise(resolve => setTimeout(resolve, 800));
        const detail = dummyDetails[id_product];
        
        if (detail) {
            return {
                status: true,
                data: detail,
                options: dummyOptions
            };
        }
        
        return {
            status: false,
            message: 'Data tidak ditemukan'
        };
    }
};
