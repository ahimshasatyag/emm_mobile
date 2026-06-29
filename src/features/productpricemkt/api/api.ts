import { ProductPriceMktProduct, ProductPriceMktDetail, ProductPriceMktOption } from '../types/productpricemkt.types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Dummy list produk aktif (dari m_product_price JOIN m_product)
const dummyProducts: ProductPriceMktProduct[] = [
    { id_product: 'PRD-001', code_product: 'P001', nm_product: 'Mesin Jahit Juki DDL-8700' },
    { id_product: 'PRD-002', code_product: 'P002', nm_product: 'Mesin Obras Pegasus M700' },
    { id_product: 'PRD-003', code_product: 'P003', nm_product: 'Mesin Potong KM EK-9' },
    { id_product: 'PRD-004', code_product: 'P004', nm_product: 'Mesin Bordir Tajima TMCE-SC' },
    { id_product: 'PRD-005', code_product: 'P005', nm_product: 'Mesin Jahit Singer Heavy Duty' },
];

const dummyOptions: Record<string, ProductPriceMktOption[]> = {
    'PRD-001': [
        { nm_product_opt: 'Dudukan Jarum Ekstra', amount: '15', kurs: '16400', estimasi: '246000' },
        { nm_product_opt: 'Meja Kerja Stainless', amount: '50', kurs: '16400', estimasi: '820000' },
    ],
    'PRD-002': [
        { nm_product_opt: 'Pisau Potong Obras', amount: '8', kurs: '16400', estimasi: '131200' },
    ],
    'PRD-003': [],
    'PRD-004': [
        { nm_product_opt: 'Jarum Bordir Set', amount: '10', kurs: '16400', estimasi: '164000' },
        { nm_product_opt: 'Benang Warna 50pcs', amount: '25', kurs: '16400', estimasi: '410000' },
        { nm_product_opt: 'Frame Bordir Medium', amount: '20', kurs: '16400', estimasi: '328000' },
    ],
    'PRD-005': [],
};

export const productPriceMktApi = {
    getProducts: async (): Promise<ProductPriceMktProduct[]> => {
        await delay(600);
        return [...dummyProducts];
    },

    getDetail: async (id_product: string): Promise<{ detail: ProductPriceMktDetail; options: ProductPriceMktOption[] } | null> => {
        await delay(500);
        const found = dummyProducts.find(p => p.id_product === id_product);
        if (!found) return null;

        const kurs = 16400;
        const priceAgent = Math.floor(300 + Math.random() * 200);
        const daysAgo = Math.floor(Math.random() * 180);
        const dateUpdate = new Date(Date.now() - daysAgo * 86400000).toISOString();
        const isRecent = daysAgo <= 90;

        const detail: ProductPriceMktDetail = {
            id_product: found.id_product,
            code_product: found.code_product,
            nm_product: found.nm_product,
            product_price: String(priceAgent + 30),
            product_price_agent: String(priceAgent),
            date_update: dateUpdate,
            kurs_bank: String(kurs),
            estimasi: String(Math.round(priceAgent * kurs / 1000000) * 1000000),
            link_brosur: null,
            is_recent: isRecent,
        };

        return { detail, options: dummyOptions[id_product] || [] };
    }
};
