import { Payment, PaymentFormData, PaymentSupportData, InvoiceDetail } from '../types/payment';
import { api } from '../../../services/api/api';

export const fetchPayments = async (search?: string): Promise<Payment[]> => {
    const response = await api.get('/payment', { params: { search, per_page: 1000 } });
    if (Array.isArray(response.data)) return response.data;
    if (Array.isArray(response.data?.data)) return response.data.data;
    if (Array.isArray(response.data?.data?.data)) return response.data.data.data;
    return [];
};

export const fetchPaymentById = async (id: string): Promise<Payment | undefined> => {
    const response = await api.get(`/payment/${id}`);
    return response.data?.data || undefined;
};

export const fetchSupportData = async (): Promise<PaymentSupportData> => {
    const response = await api.get('/payment/support-data');
    return response.data;
};

export const fetchInvoiceByCustomer = async (id_customers: string): Promise<any[]> => {
    const response = await api.get(`/payment/invoice-customers/${id_customers}`);
    return response.data?.data || [];
};

export const fetchCustomerByInvoice = async (id_invoice: string): Promise<InvoiceDetail[]> => {
    const response = await api.get(`/payment/invoice/${id_invoice}`);
    return response.data?.data || [];
};

export const createPayment = async (data: PaymentFormData): Promise<any> => {
    const response = await api.post('/payment', data);
    return response.data;
};

export const updatePayment = async (id: string, data: PaymentFormData): Promise<any> => {
    const response = await api.post(`/payment/${id}`, data);
    return response.data;
};

export const changeStatus = async (
    id_payment_schdl: string | string[], 
    status: string, 
    tgl_status: string, 
    alasan?: string
): Promise<any> => {
    const response = await api.post('/payment/ganti-status', {
        id_payment_schdl,
        status,
        tgl_status,
        alasan
    });
    return response.data;
};

export const cancelPayment = async (id: string): Promise<any> => {
    const response = await api.post(`/payment/${id}/delete`);
    return response.data;
};

export const splitPayment = async (id: string, data: { id_invoice: string, id_customers: string, id_bank?: string, payments: any[] }): Promise<any> => {
    const response = await api.post(`/payment/${id}/split`, data);
    return response.data;
};
