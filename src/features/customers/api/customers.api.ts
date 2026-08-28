import api from '../../../services/api/api';
import { Customer, CustomerFormData, Province, Regency, CustomerDetailResponse } from '../types/customers.types';

export const customersApi = {
    fetchCustomers: async (): Promise<{ success: boolean; data?: Customer[]; message?: string }> => {
        try {
            const response = await api.get('/customers');
            return { success: true, data: response.data.data };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || 'Gagal mengambil data pelanggan' };
        }
    },

    fetchProvinces: async (): Promise<{ success: boolean; data?: Province[]; message?: string }> => {
        try {
            const response = await api.get('/customers/support-data');
            return { success: true, data: response.data.data.provinsi_list };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || 'Gagal mengambil data provinsi' };
        }
    },

    fetchKabupaten: async (kodeProvinsi: string): Promise<{ success: boolean; data?: Regency[]; message?: string }> => {
        try {
            const response = await api.get(`/customers/kabupaten?kode_provinsi=${kodeProvinsi}`);
            return { success: true, data: response.data.data };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || 'Gagal mengambil data kabupaten' };
        }
    },

    fetchCustomerById: async (id: string): Promise<{ success: boolean; data?: CustomerDetailResponse; message?: string }> => {
        try {
            const response = await api.get(`/customers/${id}`);
            return {
                success: true,
                data: {
                    customer: response.data.data.customer,
                    contacts: response.data.data.customer.contacts || [],
                    so_list: response.data.data.so_list || []
                }
            };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || 'Gagal mengambil detail pelanggan' };
        }
    },

    createCustomer: async (data: CustomerFormData): Promise<{ success: boolean; data?: Customer; message?: string }> => {
        try {
            const response = await api.post('/customers', data);
            return { success: true, data: response.data.data };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || 'Gagal membuat pelanggan' };
        }
    },

    updateCustomer: async (id: string, data: CustomerFormData): Promise<{ success: boolean; data?: Customer; message?: string }> => {
        try {
            const response = await api.put(`/customers/${id}`, data);
            return { success: true, data: response.data.data };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || 'Gagal memperbarui pelanggan' };
        }
    },

    deleteCustomer: async (id: string): Promise<{ success: boolean; message?: string }> => {
        try {
            await api.delete(`/customers/${id}`);
            return { success: true };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || 'Gagal menghapus pelanggan' };
        }
    }
};
