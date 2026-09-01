import { ProductPriceReq, ProductPriceReqProduct, ProductPriceReqPayload } from '../types/productpricereq.types';
import api from '../../../services/api/api';

const getRequests = async (): Promise<ProductPriceReq[]> => {
    const response = await api.get('/productpricereq');
    return response.data.data;
};

const getProducts = async (): Promise<ProductPriceReqProduct[]> => {
    const response = await api.get('/productpricereq/support-data');
    return response.data.data.data_product;
};

const getRequestById = async (id: string): Promise<ProductPriceReq | null> => {
    const response = await api.get(`/productpricereq/${id}`);
    return response.data.data;
};

const createRequest = async (payload: ProductPriceReqPayload): Promise<ProductPriceReq> => {
    const response = await api.post('/productpricereq', payload);
    return response.data.data;
};

const updateRequest = async (id: string, payload: ProductPriceReqPayload & { f_acc?: number }): Promise<ProductPriceReq> => {
    const response = await api.put(`/productpricereq/${id}`, payload);
    return response.data.data;
};

const changeStatus = async (id: string, status: string): Promise<ProductPriceReq> => {
    const response = await api.patch(`/productpricereq/${id}/status`, { status });
    return response.data.data;
};

export const productPriceReqApi = {
    getRequests,
    getProducts,
    getRequestById,
    createRequest,
    updateRequest,
    changeStatus,
};
