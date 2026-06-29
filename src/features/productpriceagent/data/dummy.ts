import { ProductPriceAgentProduct, ProductPriceAgentDetail } from '../types/productpriceagent.types';

export const dummyProducts: ProductPriceAgentProduct[] = [
    {
        id_product: 'PRD-001',
        code_product: 'PRD/001/A',
        nm_product: 'Mesin Industri Tipe A',
    },
    {
        id_product: 'PRD-002',
        code_product: 'PRD/002/B',
        nm_product: 'Kompresor Heavy Duty',
    },
    {
        id_product: 'PRD-003',
        code_product: 'PRD/003/C',
        nm_product: 'Generator Set 5000W',
    }
];

export const dummyDetails: Record<string, ProductPriceAgentDetail> = {
    'PRD-001': {
        id_product: 'PRD-001',
        code_product: 'PRD/001/A',
        nm_product: 'Mesin Industri Tipe A',
        product_price_agent: 1500,
        date_update: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        kurs_bank: 15500,
        estimasi: 1500 * 15500,
        link_brosur: 'brosur_a.pdf'
    },
    'PRD-002': {
        id_product: 'PRD-002',
        code_product: 'PRD/002/B',
        nm_product: 'Kompresor Heavy Duty',
        product_price_agent: 850,
        date_update: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
        kurs_bank: 15500,
        estimasi: 850 * 15500,
    },
    'PRD-003': {
        id_product: 'PRD-003',
        code_product: 'PRD/003/C',
        nm_product: 'Generator Set 5000W',
        product_price_agent: 2100,
        date_update: new Date().toISOString(),
        kurs_bank: 15500,
        estimasi: 2100 * 15500,
        link_brosur: 'brosur_gen.pdf'
    }
};

export const dummyOptions = {
    kurs_usd: 15500
};
