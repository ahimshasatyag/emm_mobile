import api from '../../../services/api/api';
import { SalesOrder, SOItem } from '../types/so.types';

const mapBackendToFrontend = (data: any): SalesOrder => {
    return {
        id_so: data.id_so?.toString() || '',
        code_so: data.code_so || '',
        date_so: data.date_so || '',
        status_so: data.status_so || '',
        id_karyawan: data.id_karyawan?.toString() || '',
        nm_karyawan: data.nm_karyawan || '',
        id_customers: data.id_customers?.toString() || '',
        nm_customers: data.nm_customers || '',
        customers_address: data.customers_address || '',
        customers_email: data.customers_email || '',
        customers_phone: data.customers_phone || '',
        no_po_cust: data.no_po_cust || '',

        // Delivery & Logistic
        date_estimasi: data.date_estimasi || '',
        delivery_term: data.delivery_term || '',
        freight: data.freight?.toString() || '',
        freight_amount: data.freight_amount?.toString() || '0',
        teknisi: data.teknisi?.toString() || '',
        teknisi_amount: data.teknisi_amount?.toString() || '0',
        forklift: data.forklift?.toString() || '',
        forklift_amount: data.forklift_amount?.toString() || '0',

        // Payment & Finance
        vcurrency: data.vcurrency || 'IDR',
        nkurs: data.nkurs?.toString() || '1',
        flag_ppn: data.flag_ppn?.toString() || '0',
        id_type_pembayaran: data.id_type_pembayaran?.toString() || '',
        nm_type_pembayaran: data.nm_type_pembayaran || '',
        ndp_persen: data.ndp_persen?.toString() || '0',
        ndp_amount: data.ndp_amount?.toString() || '0',
        ntenor: data.ntenor?.toString() || '0',
        ntenor_amount: data.ntenor_amount?.toString() || '0',
        id_cara_pembayaran: data.id_cara_pembayaran?.toString() || '',
        nm_cara_pembayaran: data.nm_cara_pembayaran || '',
        id_waktu_bayar: data.id_waktu_bayar?.toString() || '',
        nm_waktu_bayar: data.nm_waktu_bayar || '',

        // Additional Info
        keterangan: data.keterangan || '',
        code_so_excel: data.code_so_excel || '',
        success_fee: data.success_fee?.toString() || '0',
        internal_notes: data.internal_notes || '',

        items: Array.isArray(data.details) ? data.details.map((detail: any): SOItem => ({
            id_item: detail.id_product?.toString(),
            product_code: detail.code_product || '',
            product_name: detail.nm_product || '',
            status_barang: detail.status_barang || '',
            harga: detail.product_price?.toString() || '0',
            qty: detail.nqty?.toString() || '0',
            satuan: detail.nm_product_satuan || '',
            delivery_term: detail.delivery_term || '',
        })) : []
    };
};

const mapFrontendToBackend = (data: Partial<SalesOrder>): any => {
    return {
        id_karyawan: data.id_karyawan,
        date_estimasi: data.date_estimasi,
        id_type_pembayaran: data.id_type_pembayaran,
        id_cara_pembayaran: data.id_cara_pembayaran,
        id_waktu_bayar: data.id_waktu_bayar,
        ndp_amount: data.ndp_amount,
        ndp_persen: data.ndp_persen,
        ntenor: data.ntenor,
        ntenor_amount: data.ntenor_amount,
        customers_address: data.customers_address,
    };
};

export const soApi = {
    fetchSOList: async (): Promise<SalesOrder[]> => {
        const response = await api.get('/so?per_page=500');
        if (response.data && response.data.data) {
            // Laravel pagination returns items in data.data
            const items = response.data.data.data || response.data.data;
            if (Array.isArray(items)) {
                return items.map(mapBackendToFrontend);
            }
        }
        return [];
    },

    getSOById: async (id: string): Promise<SalesOrder | undefined> => {
        const response = await api.get(`/so/${id}`);
        if (response.data && response.data.data) {
            return mapBackendToFrontend(response.data.data);
        }
        throw new Error('Sales Order not found');
    },

    createSO: async (data: SalesOrder): Promise<SalesOrder> => {
        throw new Error("SO creation is not supported directly. Create from Quotation.");
    },

    updateSO: async (id: string, data: Partial<SalesOrder>): Promise<SalesOrder> => {
        const backendData = mapFrontendToBackend(data);
        const response = await api.post(`/so/${id}`, backendData);
        if (response.data && response.data.status) {
            return { ...data } as SalesOrder;
        }
        throw new Error('Failed to update SO');
    },

    extendGaransi: async (id: string, days: number): Promise<{ success: boolean; message: string }> => {
        throw new Error("Not implemented yet");
    },

    confirmSO: async (id_so: string): Promise<any> => {
        const response = await api.post('/so/confirm', { id_so });
        if (response.data && response.data.status) {
            return response.data;
        }
        throw new Error(response.data?.message || 'Failed to confirm SO');
    },

    checkPayment: async (id_so: string, tgl_status?: string): Promise<any> => {
        const response = await api.post('/so/check-payment', { id_so, tgl_status });
        if (response.data && response.data.status) {
            return response.data;
        }
        throw new Error(response.data?.message || 'Failed to check payment');
    },

    cancelSO: async (id_so: string, alasan: string, username?: string): Promise<any> => {
        const response = await api.post('/so/cancel', { id_so, alasan, username });
        if (response.data && response.data.status) {
            return response.data;
        }
        throw new Error(response.data?.message || 'Failed to cancel SO');
    }
};
