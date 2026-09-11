import api from '../../../services/api/api';
import { CustomerInvoice } from '../types/customerinvoice';

export const customerinvoiceApi = {
    getList: async (params?: {
        search?: string;
        status_invoice?: string;
        date_from?: string;
        date_to?: string;
        per_page?: number;
    }): Promise<CustomerInvoice[]> => {
        const res = await api.get('/customerinvoice', { params: { per_page: 500, ...params } });
        // Backend returns paginated: { status, data: { data: [...] } }
        const payload = res.data?.data;
        if (Array.isArray(payload)) return payload;
        if (Array.isArray(payload?.data)) return payload.data;
        return [];
    },

    getDetail: async (id: string): Promise<CustomerInvoice> => {
        const res = await api.get(`/customerinvoice/${id}`);
        return res.data?.data;
    },

    storeInvoiceDetail: async (payload: {
        id_invoice: string | number;
        id_invoice_dtl?: string | number | null;
        id_payment_method: string | number;
        date_payment?: string;
        id_bank?: string | number | null;
        payment_ref?: string;
        nkurs?: string | number;
        dp?: string | number;
        v_amount: string | number;
        code_giro?: string | null;
        retur_penjualan_id?: string | number | null;
        id_kb_masuk?: string | number | null;
    }) => {
        const res = await api.post('/customerinvoice/invoice-detail', payload);
        return res.data;
    },

    gantiStatus: async (payload: {
        id_invoice_dtl: string | number;
        status: 'TERIMA' | 'SETOR' | 'CAIR' | 'TOLAK' | 'BATAL';
        tgl_status: string;
        alasan?: string;
    }) => {
        const res = await api.post('/customerinvoice/ganti-status', payload);
        return res.data;
    },

    backStatus: async (payload: {
        id_invoice: string | number;
        id_invoice_dtl: string | number;
    }) => {
        const res = await api.post('/customerinvoice/back-status', payload);
        return res.data;
    },

    posting: async (payload: {
        id_invoice: string | number;
        id_invoice_dtl: string | number;
        id_customers: string | number;
    }) => {
        const res = await api.post('/customerinvoice/posting', payload);
        return res.data;
    },

    unposting: async (payload: {
        id_invoice: string | number;
        id_invoice_dtl: string | number;
        id_customers: string | number;
    }) => {
        const res = await api.post('/customerinvoice/unposting', payload);
        return res.data;
    },

    getSupportData: async (id_invoice: string | number) => {
        const res = await api.get('/customerinvoice/support-data', { params: { id_invoice } });
        return res.data;
    },

    getArPelunasan: async (id_invoice: string | number, id_invoice_dtl: string | number) => {
        const res = await api.get('/customerinvoice/ar-pelunasan', { params: { id_invoice, id_invoice_dtl } });
        return res.data;
    },

    simpanArPelunasan: async (payload: {
        id_invoice: string | number;
        id_customers: string | number;
        id_invoice_dtl: string | number;
        date_ar_pelunasan: string;
        vpaid_amount: number;
        memo?: string;
        data_dtl?: any[];
    }) => {
        const res = await api.post('/customerinvoice/ar-pelunasan', payload);
        return res.data;
    },

    getRetur: async (id_invoice: string | number) => {
        const res = await api.get('/customerinvoice/retur', { params: { id_invoice } });
        return res.data;
    },

    getKbMasuk: async (id_invoice: string | number) => {
        const res = await api.get('/customerinvoice/kb-masuk', { params: { id_invoice } });
        return res.data;
    },

    getDataGiro: async (params: {
        id_invoice: string | number;
        id_customers: string | number;
        id_giro?: string | number;
    }) => {
        const res = await api.get('/customerinvoice/giro', { params });
        return res.data;
    },

    updateCodePi: async (id_invoice: string | number) => {
        const res = await api.post('/customerinvoice/update-code-pi', { id_invoice });
        return res.data;
    },
};
