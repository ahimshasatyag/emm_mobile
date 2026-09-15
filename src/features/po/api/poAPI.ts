import { PoHeader } from "../types/po.types";
import { api } from '../../../services/api/api';

class PoApi {
    async fetchList(search?: string): Promise<PoHeader[]> {
        const response = await api.get('/po', { params: { search, per_page: 1000 } });
        return Array.isArray(response.data?.data) ? response.data.data : ((response.data?.data as any)?.data || []);
    }

    async fetchDetail(id: string): Promise<PoHeader> {
        const response = await api.get(`/po/${id}`);
        const { data, data_detail } = response.data;
        return {
            ...data,
            details: data_detail || []
        };
    }

    async supportData(): Promise<any> {
        const response = await api.get('/po/support-data');
        return response.data;
    }

    // Note: Assuming we can reuse the product-detail endpoint from quotationsap for PO if it's the same
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
        const response = await api.post('/po', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    }

    async update(id: string, data: FormData): Promise<any> {
        data.append('_method', 'PUT'); // Laravel requirement for PUT with FormData
        const response = await api.post(`/po/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    }

    async confirm(id: string): Promise<any> {
        const response = await api.post(`/po/${id}/confirm`);
        return response.data;
    }

    async cancel(id: string): Promise<any> {
        const response = await api.post(`/po/${id}/cancel`);
        return response.data;
    }
}

export const poAPI = new PoApi();
