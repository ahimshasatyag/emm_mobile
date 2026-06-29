import { ProductPrice } from '../types/productprice.types';

export const dummyProductPrices: ProductPrice[] = [
    {
        id_product: 'PRD-001',
        code_product: 'P001',
        nm_product: 'Mesin Jahit Juki',
        nm_product_brand: 'Juki',
        product_price: '350',
        product_price_agent: '320',
        waktu: new Date().toISOString(),
        aksi: 'NEW',
        flag_active: 't',
        kurs: '16400',
        est_idr: '5740000'
    },
    {
        id_product: 'PRD-002',
        code_product: 'P002',
        nm_product: 'Mesin Obras Pegasus',
        nm_product_brand: 'Pegasus',
        product_price: '400',
        product_price_agent: '380',
        waktu: new Date(Date.now() - 86400000).toISOString(),
        aksi: 'UPDATE',
        flag_active: 't',
        kurs: '16400',
        est_idr: '6560000'
    },
    {
        id_product: 'PRD-003',
        code_product: 'P003',
        nm_product: 'Mesin Potong KM',
        nm_product_brand: 'KM',
        product_price: '150',
        product_price_agent: '130',
        waktu: new Date(Date.now() - 172800000).toISOString(),
        aksi: '',
        flag_active: 't',
        kurs: '16400',
        est_idr: '2460000'
    }
];
