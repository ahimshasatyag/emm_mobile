import { HomeData } from '../types/home.types';
import api from '../../../services/api/api';

export const fetchHomeDataApi = async (): Promise<HomeData> => {
    try {
        const currentDate = new Date();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = currentDate.getFullYear();

        const [
            reqStatsRes,
            tekPPRes,
            tekPLRes,
            jadwalLktRes,
            agingArRes,
            quotationStatsRes,
            topProdQuotRes,
            topPriceCheckRes
        ] = await Promise.all([
            api.post('/dashboard/data_total_request_pending_progres'),
            api.get('/dashboard/data_teknisi_pp'),
            api.get('/dashboard/data_teknisi_pl'),
            api.get('/dashboard/data_jadwal_lkt'),
            api.post('/dashboard/aging_ar'),
            api.get(`/dashboard/quotation_and_so_statistics/${month}/${year}`),
            api.get(`/dashboard/top_products_quotations/${month}/${year}`),
            api.get(`/dashboard/top_20_price_check_products/${month}/${year}`)
        ]);

        return {
            requestStats: reqStatsRes.data,
            teknisiPP: tekPPRes.data?.data || [],
            teknisiPL: tekPLRes.data?.data || [],
            jadwalLkt: jadwalLktRes.data?.data || [],
            agingAr: agingArRes.data || [],
            quotationStats: quotationStatsRes.data,
            topProductsQuotation: topProdQuotRes.data?.data || [],
            topPriceCheck: topPriceCheckRes.data || []
        };
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || 'Gagal mengambil data dashboard');
    }
};

export const fetchRequestCsrApi = async () => {
    const res = await api.get('/dashboard/data_request_csr');
    return res.data;
};

export const fetchPendingCstApi = async () => {
    const res = await api.get('/dashboard/data_pending_cst');
    return res.data;
};

export const fetchOngoingCstApi = async () => {
    const res = await api.get('/dashboard/data_ongoing_cst');
    return res.data;
};
