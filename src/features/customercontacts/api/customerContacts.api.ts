import { CustomerContact, CustomerContactFormData } from '../types/customerContacts.types';
import api from '../../../services/api/api';

export const customerContactsApi = {
    fetchCustomerContacts: async (): Promise<{ success: boolean; data: CustomerContact[] }> => {
        try {
            const response = await api.get('/customerscontact');
            return { success: true, data: response.data.data };
        } catch (error: any) {
            return { success: false, data: [] };
        }
    },

    fetchCustomerContactById: async (id: string): Promise<{ success: boolean; data: CustomerContact }> => {
        try {
            const response = await api.get(`/customerscontact/${id}`);
            return { success: true, data: response.data.data };
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Customer Contact not found');
        }
    },

    createCustomerContact: async (data: CustomerContactFormData): Promise<{ success: boolean; message?: string; data?: any }> => {
        try {
            const response = await api.post('/customerscontact', data);
            return { success: true, message: 'Customer Contact created successfully', data: response.data.data };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || 'Failed to create' };
        }
    },

    updateCustomerContact: async (id: string, data: CustomerContactFormData): Promise<{ success: boolean; message?: string }> => {
        try {
            await api.put(`/customerscontact/${id}`, data);
            return { success: true, message: 'Customer Contact updated successfully' };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || 'Failed to update' };
        }
    },

    deleteCustomerContact: async (id: string): Promise<{ success: boolean; message?: string }> => {
        try {
            await api.delete(`/customerscontact/${id}`);
            return { success: true, message: 'Customer Contact deleted successfully' };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || 'Failed to delete' };
        }
    }
};
