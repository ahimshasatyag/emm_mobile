export interface Contact {
    number: string;
    date_create: string; // ISO String or similar
}

export interface ChatMessage {
    mobile_number_sender: string;
    message: string;
    date_create: string; // timestamp or readable
}

export interface MessageLog {
    id_message_wa: number;
    mobile_number: string;
    message: string;
    memo?: string;
    date_create: string;
    date_update?: string | null;
    flag_status: number; // 0 = BELUM TERKIRIM, 1 = TERKIRIM, 2 = GAGAL
    username_create?: string;
    flag_group?: number;
}
