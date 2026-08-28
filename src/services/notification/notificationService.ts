import api from '../api/api';
import { Notification, NotificationResponse } from '../../types/notification';

export const notificationService = {
    getAll: async (user_id?: number) => {
        const url = user_id ? `/notification?user_id=${user_id}` : '/notification';
        const response = await api.get<NotificationResponse>(url);
        return response.data;
    },
    getById: async (id: number) => {
        const response = await api.get<{ status: string; message: string; data: Notification }>(`/notification/${id}`);
        return response.data;
    },
    store: async (data: { user_id: number; id_users_level: number; kode_trans: string; judul: string; pesan: string; action: string }) => {
        const response = await api.post('/notification', data);
        return response.data;
    },
    update: async (id: number, data: Partial<Notification>) => {
        const response = await api.put(`/notification/${id}`, data);
        return response.data;
    },
    destroy: async (id: number) => {
        const response = await api.delete(`/notification/${id}`);
        return response.data;
    },
    markAllAsRead: async (user_id: number) => {
        const response = await api.post('/notification/mark-all-read', { user_id });
        return response.data;
    }
};
