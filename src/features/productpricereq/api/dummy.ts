import { ProductPriceReq, ProductPriceReqProduct, ProductPriceReqPayload } from '../types/productpricereq.types';
import { DUMMY_REQUESTS, DUMMY_PRODUCTS } from '../data/dummyProductPriceReq';

// In-memory store for dummy data
let requests = [...DUMMY_REQUESTS];
let products = [...DUMMY_PRODUCTS];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getRequests = async (): Promise<ProductPriceReq[]> => {
    await delay(600);
    return [...requests];
};

export const getProducts = async (): Promise<ProductPriceReqProduct[]> => {
    await delay(300);
    return [...products];
};

export const getRequestById = async (id: string): Promise<ProductPriceReq | null> => {
    await delay(300);
    return requests.find(r => r.id === id) || null;
};

export const createRequest = async (payload: ProductPriceReqPayload): Promise<ProductPriceReq> => {
    await delay(600);
    const product = products.find(p => p.id_product === payload.id_product);
    if (!product) throw new Error('Product not found');

    const newRequest: ProductPriceReq = {
        id: `REQ-${Date.now()}`,
        id_product: product.id_product,
        code_product: product.code_product,
        nm_product: product.nm_product,
        nm_users: 'Budi Santoso', // Mocked user
        status: 'DRAFT',
        product_price_req: 0,
        product_price_acc: 0
    };

    requests.push(newRequest);
    return newRequest;
};

export const updateRequest = async (id: string, payload: ProductPriceReqPayload): Promise<ProductPriceReq> => {
    await delay(600);
    const index = requests.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Request not found');

    const req = requests[index];

    if (payload.id_product) {
        const product = products.find(p => p.id_product === payload.id_product);
        if (product) {
            req.id_product = product.id_product;
            req.code_product = product.code_product;
            req.nm_product = product.nm_product;
        }
    }

    if (payload.product_price_acc !== undefined) {
        req.product_price_acc = payload.product_price_acc;
        // As per PHP Cform.php if f_acc is true, update price and change status to SUCCESS
        req.status = 'SUCCESS'; 
    }

    requests[index] = { ...req };
    return requests[index];
};

export const changeStatus = async (id: string, status: string): Promise<ProductPriceReq> => {
    await delay(600);
    const index = requests.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Request not found');

    requests[index] = { ...requests[index], status };
    return requests[index];
};
