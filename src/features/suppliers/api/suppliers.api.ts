import { Supplier } from '../types/suppliers.types';
import { api } from '../../../services/api/api';

export const fetchSuppliers = async (search?: string): Promise<{ data: Supplier[] }> => {
    const response = await api.get('/suppliers', { params: { search, per_page: 1000 } });
    return response.data;
};

export const getSupplierById = async (id: string): Promise<any> => {
    const response = await api.get(`/suppliers/${id}`);
    return response.data;
};

export const getSupportData = async (): Promise<any> => {
    const response = await api.get('/suppliers/support-data');
    return response.data;
};

export const createSupplier = async (formData: FormData): Promise<any> => {
    const response = await api.post('/suppliers', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const updateSupplier = async (id: string, formData: FormData): Promise<any> => {
    formData.append('_method', 'PUT'); // Laravel requirement for form-data PUT
    const response = await api.post(`/suppliers/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};
