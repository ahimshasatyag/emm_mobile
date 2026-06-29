import { ProductPriceReq, ProductPriceReqProduct } from '../types/productpricereq.types';

export const DUMMY_PRODUCTS: ProductPriceReqProduct[] = [
    { id_product: 'P001', code_product: 'PRD-001', nm_product: 'Cangkir Kopi Keramik' },
    { id_product: 'P002', code_product: 'PRD-002', nm_product: 'Sendok Teh Stainless' },
    { id_product: 'P003', code_product: 'PRD-003', nm_product: 'Piring Kaca Bening' },
    { id_product: 'P004', code_product: 'PRD-004', nm_product: 'Gelas Plastik Merah' },
    { id_product: 'P005', code_product: 'PRD-005', nm_product: 'Mangkuk Sup Keramik' }
];

export const DUMMY_REQUESTS: ProductPriceReq[] = [
    {
        id: 'REQ-001',
        id_product: 'P001',
        code_product: 'PRD-001',
        nm_product: 'Cangkir Kopi Keramik',
        nm_users: 'Budi Santoso',
        status: 'DRAFT',
        product_price_req: 0,
        product_price_acc: 0
    },
    {
        id: 'REQ-002',
        id_product: 'P002',
        code_product: 'PRD-002',
        nm_product: 'Sendok Teh Stainless',
        nm_users: 'Andi M',
        status: 'CONFIRM',
        product_price_req: 0,
        product_price_acc: 0
    },
    {
        id: 'REQ-003',
        id_product: 'P003',
        code_product: 'PRD-003',
        nm_product: 'Piring Kaca Bening',
        nm_users: 'Admin',
        status: 'SUCCESS',
        product_price_req: 0,
        product_price_acc: 15000
    }
];
