import { Lkt, LktDetail, LktFilter, LktFormPayload, RealisasiFormPayload, TeknisiOption } from '../types/lkt.types';
import api from '../../../services/api/api';

const encodeId = (id: string | number) => String(id).replace(/\//g, '.');

async function appendImageToFormData(formData: FormData, key: string, uri: string) {
    if (!uri) return;
    if (uri.startsWith('file://') || uri.startsWith('content://')) {
        const filename = uri.split('/').pop() || 'image.jpg';
        const match = /\.(\w+)$/.exec(filename.toLowerCase());
        let type = match ? `image/${match[1]}` : 'image/jpeg';
        if (type === 'image/jpg') type = 'image/jpeg';
        formData.append(key, { uri, name: filename, type } as any);
    } else if (uri.startsWith('data:') || uri.startsWith('blob:')) {
        try {
            const res = await fetch(uri);
            const blob = await res.blob();
            formData.append(key, blob, 'image.jpeg');
        } catch (e) {
            console.error('Failed to fetch blob:', e);
        }
    }
    // skip http/https URLs (already on server)
}

export const lktApi = {
    // ===== LKT List =====
    getAll: async (): Promise<Lkt[]> => {
        const response = await api.get('/lkt');
        return response.data.data;
    },

    // ===== LKT Detail =====
    getById: async (id: string): Promise<LktDetail> => {
        const response = await api.get(`/lkt/${encodeId(id)}`);
        return response.data.data;
    },

    // ===== Create LKT =====
    create: async (payload: LktFormPayload): Promise<any> => {
        const formData = new FormData();
        formData.append('cst_code', payload.cst_code);
        formData.append('starting_date', payload.starting_date);
        formData.append('estimation_day', String(payload.estimation_day));
        formData.append('description', payload.description);
        formData.append('service_amount', String(payload.service_amount));
        formData.append('transport_amount', String(payload.transport_amount));
        formData.append('accommodation_amount', String(payload.accommodation_amount));
        if (payload.type_transport) formData.append('type_transport', payload.type_transport);
        if (payload.added_by) formData.append('added_by', payload.added_by);
        if (payload.image) await appendImageToFormData(formData, 'image', payload.image);

        const response = await api.post('/lkt', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // ===== Update LKT =====
    update: async (id: string, payload: any): Promise<any> => {
        const formData = new FormData();
        const skip = ['image', 'bast', 'parts'];
        for (const [key, value] of Object.entries(payload)) {
            if (skip.includes(key) || value === undefined || value === null) continue;
            formData.append(key, String(value));
        }
        if (payload.image) await appendImageToFormData(formData, 'image', payload.image);
        if (payload.parts && Array.isArray(payload.parts)) {
            payload.parts.forEach((p: any, i: number) => {
                formData.append(`parts[${i}][nama_part]`, p.nama_part);
                formData.append(`parts[${i}][qty]`, String(p.qty));
                formData.append(`parts[${i}][harga]`, String(p.harga));
            });
        }
        const response = await api.post(`/lkt/${encodeId(id)}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // ===== Done/Close LKT (upload BAST) =====
    done: async (id: string, payload: any): Promise<any> => {
        const formData = new FormData();
        if (payload.done_by) formData.append('done_by', payload.done_by);
        if (payload.user_id) formData.append('user_id', String(payload.user_id));
        if (payload.id_users_level) formData.append('id_users_level', String(payload.id_users_level));
        if (payload.bast) await appendImageToFormData(formData, 'bast', payload.bast);

        const response = await api.post(`/lkt/${encodeId(id)}/done`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // ===== Cancel LKT =====
    cancel: async (id: string, payload: any): Promise<any> => {
        const response = await api.post(`/lkt/${encodeId(id)}/cancel`, payload);
        return response.data;
    },

    // ===== Get Teknisi Options =====
    getTeknisiOptions: async (): Promise<TeknisiOption[]> => {
        const response = await api.get('/lkt/teknisi-options');
        return response.data.data;
    },

    // ===== Realisasi: Store (Add Visit) =====
    storeRealisasi: async (lktId: string, payload: RealisasiFormPayload): Promise<any> => {
        const formData = new FormData();
        formData.append('actual_starting_date', payload.actual_starting_date);
        formData.append('actual_day', String(payload.actual_day));
        formData.append('actual_description', payload.actual_description);
        formData.append('actual_service_amount', String(payload.actual_service_amount));
        formData.append('actual_transport_amount', String(payload.actual_transport_amount));
        formData.append('actual_accommodation_amount', String(payload.actual_accommodation_amount));
        formData.append('actual_training', String(payload.actual_training));
        formData.append('actual_bongkar', String(payload.actual_bongkar));
        formData.append('flag_daring', payload.flag_daring ? '1' : '0');
        payload.teknisi_ids.forEach((id, i) => {
            formData.append(`teknisi_ids[${i}]`, String(id));
        });
        if (payload.added_by) formData.append('added_by', payload.added_by);
        if (payload.image) await appendImageToFormData(formData, 'image', payload.image);

        const response = await api.post(`/lkt/${encodeId(lktId)}/realisasi`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // ===== Realisasi: Update Visit =====
    updateRealisasi: async (lktSubCode: string, payload: RealisasiFormPayload): Promise<any> => {
        const formData = new FormData();
        formData.append('actual_starting_date', payload.actual_starting_date);
        formData.append('actual_day', String(payload.actual_day));
        formData.append('actual_description', payload.actual_description);
        formData.append('actual_service_amount', String(payload.actual_service_amount));
        formData.append('actual_transport_amount', String(payload.actual_transport_amount));
        formData.append('actual_accommodation_amount', String(payload.actual_accommodation_amount));
        formData.append('actual_training', String(payload.actual_training));
        formData.append('actual_bongkar', String(payload.actual_bongkar));
        formData.append('flag_daring', payload.flag_daring ? '1' : '0');
        payload.teknisi_ids.forEach((id, i) => {
            formData.append(`teknisi_ids[${i}]`, String(id));
        });
        if (payload.updated_by) formData.append('updated_by', payload.updated_by);
        if (payload.image) await appendImageToFormData(formData, 'image', payload.image);

        const response = await api.post(`/lkt/realisasi/${encodeId(lktSubCode)}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // ===== Realisasi: Confirm Visit =====
    confirmRealisasi: async (lktSubCode: string, payload?: any): Promise<any> => {
        const response = await api.post(`/lkt/realisasi/${encodeId(lktSubCode)}/confirm`, payload);
        return response.data;
    },

    // ===== Realisasi: Close Visit =====
    closeRealisasi: async (lktSubCode: string, payload?: any): Promise<any> => {
        const response = await api.post(`/lkt/realisasi/${encodeId(lktSubCode)}/close`, payload);
        return response.data;
    },

    // ===== Realisasi: Cancel Visit =====
    cancelRealisasi: async (lktSubCode: string, payload?: any): Promise<any> => {
        const response = await api.post(`/lkt/realisasi/${encodeId(lktSubCode)}/cancel`, payload);
        return response.data;
    },

    // ===== Realisasi: Reject Visit =====
    rejectRealisasi: async (lktSubCode: string, payload?: any): Promise<any> => {
        const response = await api.post(`/lkt/realisasi/${encodeId(lktSubCode)}/reject`, payload);
        return response.data;
    },
};
