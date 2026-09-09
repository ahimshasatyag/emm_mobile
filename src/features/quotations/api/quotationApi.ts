import api from '../../../services/api/api';
import { Quotation, QuotationItem } from '../types/quotation.types';

const mapBackendToFrontend = (data: any): Quotation => {
    return {
        id_quotation: data.id_so?.toString() || '',
        quotation_number: data.code_so?.toString() || '',
        date_so: data.date_so || '',
        customer_id: data.id_customers?.toString() || '',
        customer_name: data.nm_customers || '',
        customers_email: data.customers_email || '',
        sales_person_id: data.id_karyawan?.toString() || '',
        sales_person_name: data.nm_karyawan || '',
        total: parseFloat(data.ntot_price_netto_amount || '0'),
        status: data.status_so || '',
        created_by_name: data.nm_users || '',

        // Form specific fields mapping (handling null/undefined gracefully)
        delivery_to: data.delivery_to || data.nm_customers || '',
        informasi_pembeli: data.customers_address || data.informasi_pembeli || '',
        estimasi_pengiriman: data.date_estimasi || '',
        mata_uang: data.vcurrency === 'USD' ? 'USD' : 'IDR',
        kurs: parseFloat(data.nkurs || '1'),
        flag_ppn: (data.flag_ppn == 1 || data.flag_ppn === 'Y') ? 'Y' : 'N',
        delivery_term_header: data.delivery_term || '',

        // Biaya
        freight_type: data.freight?.toString() || '1',
        freight_charge: parseFloat(data.freight_amount || '0'),
        teknisi_type: data.teknisi?.toString() || '1',
        teknisi_charge: parseFloat(data.teknisi_amount || '0'),
        forklift_type: data.forklift?.toString() || '1',
        forklift_charge: parseFloat(data.forklift_amount || '0'),

        // Payment
        metode_payment: data.id_type_pembayaran?.toString() || '',
        dp_persen: parseFloat(data.ndp_persen || '0'),
        dp_amount: parseFloat(data.ndp_amount || '0'),
        tenor: parseInt(data.ntenor || '0'),
        tenor_amount: parseFloat(data.ntenor_amount || '0'),
        tipe_pembayaran: data.id_cara_pembayaran?.toString() || '',
        waktu_bayar: data.id_waktu_bayar?.toString() || '',

        // Others
        keterangan: data.keterangan || '',
        code_so_excel: data.code_so_excel || '',
        no_po_cust: data.no_po_cust || '',
        success_fee: parseFloat(data.success_fee || '0'),
        internal_notes: data.internal_notes || '',

        approvals: data.approvals || [],

        items: Array.isArray(data.details) ? data.details.map((detail: any): QuotationItem => ({
            id_item: detail.id_so_dtl || Math.random().toString(),
            id_product: detail.id_product,
            product_code: detail.code_product || '',
            product_name: detail.nm_product || '',
            status_barang: detail.status_barang || 'READY',
            indent_amount: parseFloat(detail.indent_amount || '0'),
            harga: parseFloat(detail.product_price || '0'),
            qty: parseFloat(detail.nqty || '0'),
            satuan: detail.nm_product_satuan || '',
            delivery_term: detail.delivery_term || '',
            line_total: parseFloat(detail.product_price || '0') * parseFloat(detail.nqty || '0'),
        })) : []
    };
};

const mapFrontendToBackend = (data: Quotation): any => {
    const result: any = {
        id_customers: data.customer_id,
        id_karyawan: data.sales_person_id,
        date_so: data.date_so,
        date_estimasi: data.estimasi_pengiriman,
        vcurrency: data.mata_uang || 'IDR',
        nkurs: data.kurs || 1,
        flag_ppn: (data.flag_ppn === 'Y' || data.flag_ppn === 1) ? 1 : 0,
        status_so: data.status || 'DRAFT QUOTATION',
        ntot_price_netto_amount: data.total,

        is_revision: data.is_revision,
        id_so_reference: data.id_so_reference,

        delivery_to: data.delivery_to,
        informasi_pembeli: data.informasi_pembeli,
        delivery_term_header: data.delivery_term_header,

        freight: data.freight_type,
        freight_charge: data.freight_charge,
        teknisi: data.teknisi_type,
        teknisi_charge: data.teknisi_charge,
        forklift: data.forklift_type,
        forklift_charge: data.forklift_charge,

        id_type_pembayaran: data.metode_payment,
        id_cara_pembayaran: data.tipe_pembayaran,
        id_waktu_bayar: (data.waktu_bayar === 'Sebelum Kirim' || data.waktu_bayar === 'CBD') ? 1 :
            (data.waktu_bayar === 'Sesudah Kirim' || data.waktu_bayar === 'COD') ? 2 : data.waktu_bayar,

        ndp_persen: data.dp_persen,
        ndp_amount: data.dp_amount,
        ntenor: data.tenor,
        ntenor_amount: data.tenor_amount,
        keterangan: data.keterangan,
        code_so_excel: data.code_so_excel,
        no_po_cust: data.no_po_cust,
        success_fee: data.success_fee,
        internal_notes: data.internal_notes,
        username_create: data.created_by_name,
        id_user: data.created_by_id || 4,

        code_product: [],
        nm_product: [],
        status_barang: [],
        product_price: [],
        qty: [],
        nm_satuan: [],
        delivery_term: []
    };

    data.items.forEach(item => {
        result.code_product.push(item.product_code);
        result.nm_product.push(item.product_name);
        result.status_barang.push(item.status_barang);
        result.product_price.push(item.harga);
        result.qty.push(item.qty);
        result.nm_satuan.push(item.satuan);
        result.delivery_term.push(item.delivery_term);

        if (item.options && Array.isArray(item.options)) {
            item.options.forEach((opt: any) => {
                result.code_product.push(opt.id_product_price_opt);
                result.nm_product.push(opt.nm_product_opt);
                result.status_barang.push(''); // Empty for options
                result.product_price.push(opt.amount);
                result.qty.push(opt.qty);
                result.nm_satuan.push(''); // Empty for options
                result.delivery_term.push('');
            });
        }
    });

    return result;
};

export const getQuotations = async (): Promise<Quotation[]> => {
    const response = await api.get('/quotations?per_page=500');
    if (response.data && response.data.data) {
        return response.data.data.map(mapBackendToFrontend);
    }
    return [];
};

export const getQuotationById = async (id: string): Promise<Quotation> => {
    const response = await api.get(`/quotations/${id}`);
    if (response.data && response.data.data) {
        return mapBackendToFrontend(response.data.data);
    }
    throw new Error('Data tidak ditemukan');
};

export const createQuotation = async (data: Quotation): Promise<Quotation> => {
    const backendData = mapFrontendToBackend(data);
    const response = await api.post('/quotations', backendData);

    if (response.data && response.data.status) {
        // API controller returns { status: true, message: "...", kode: "...", id_so: ... }
        return {
            ...data,
            id_quotation: response.data.id_so?.toString() || '',
            quotation_number: response.data.kode || '',
            requires_approval: response.data.requires_approval
        };
    }

    return data;
};

export const updateQuotation = async (id: string, data: Quotation): Promise<Quotation> => {
    const backendData = mapFrontendToBackend(data);
    const response = await api.post(`/quotations/${id}`, backendData);
    if (response.data && response.data.data) {
        return {
            ...mapBackendToFrontend(response.data.data),
            requires_approval: response.data.requires_approval
        };
    }
    return {
        ...data,
        requires_approval: response.data?.requires_approval
    };
};

export const deleteQuotation = async (id: string): Promise<void> => {
    await api.delete(`/quotations/${id}`);
};

export const confirmQuotationToSO = async (id: string): Promise<any> => {
    const response = await api.post(`/quotations/${id}/confirm-to-so`);
    return response.data;
};

export const getSupportData = async (): Promise<any> => {
    const response = await api.get('/quotations/support-data');
    if (response.data && response.data.data) {
        return {
            data_product: response.data.data.data_product,
            kurs_usd: response.data.data.kurs_usd
        };
    }
    return null;
};
