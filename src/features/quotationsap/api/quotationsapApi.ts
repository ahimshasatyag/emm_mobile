import { QuotationAP } from '../types/quotationsap.types';
import { api } from '../../../services/api/api';

class QuotationsAPApi {
    async fetchList(search?: string): Promise<QuotationAP[]> {
        const response = await api.get('/quotationsap', { params: { search, per_page: 1000 } });
        return Array.isArray(response.data?.data) ? response.data.data : ((response.data?.data as any)?.data || []);
    }

    async fetchDetail(id: string): Promise<QuotationAP> {
        const response = await api.get(`/quotationsap/${id}`);
        const { data, data_detail } = response.data;
        return {
            ...data,
            details: data_detail || []
        };
    }

    async supportData(): Promise<any> {
        const response = await api.get('/quotationsap/support-data');
        return response.data;
    }

    async getProductDetail(id_product: string): Promise<any> {
        const response = await api.post('/quotationsap/product-detail', { id_product });
        return response.data;
    }

    async getLokasi(id_gudang: string): Promise<any> {
        const response = await api.post('/quotationsap/lokasi', { id_gudang });
        return response.data;
    }

    async getMataUangDefault(id_supplier: string): Promise<any> {
        const response = await api.post('/quotationsap/mata-uang-default', { id_supplier });
        return response.data;
    }

    async create(data: FormData): Promise<any> {
        const response = await api.post('/quotationsap', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    }

    async update(id: string, data: FormData): Promise<any> {
        data.append('_method', 'PUT'); // Laravel requirement for PUT with FormData
        const response = await api.post(`/quotationsap/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    }

    async confirm(id: string): Promise<any> {
        const response = await api.post(`/quotationsap/${id}/confirm`);
        return response.data;
    }

    async cancel(id: string): Promise<any> {
        const response = await api.post(`/quotationsap/${id}/cancel`);
        return response.data;
    }
}

export const quotationsapApi = new QuotationsAPApi();
