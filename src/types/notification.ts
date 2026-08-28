export interface Notification {
    id_notifikasi: number;
    judul: string;
    pesan: string;
    action: string;
    is_read: boolean | number;
    created_at: string;
    updated_at?: string;
}

export interface NotificationResponse {
    status: string;
    message: string;
    data: Notification[];
}
