import { Contact, ChatMessage, MessageLog } from '../types/whatsappchat.types';

export const ADMIN_NUMBER = '628119157797@s.whatsapp.net';

export const MOCK_CONTACTS: Contact[] = [
    { number: '6281234567890@s.whatsapp.net', date_create: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
    { number: '6289876543210@s.whatsapp.net', date_create: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
    { number: '6285551234567@s.whatsapp.net', date_create: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
];

export const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
    '6281234567890@s.whatsapp.net': [
        {
            mobile_number_sender: '6281234567890@s.whatsapp.net',
            message: 'Halo min, orderan saya nomor INV-123 apakah sudah dikirim?',
            date_create: '21/07/2026 10:00:00',
        },
        {
            mobile_number_sender: ADMIN_NUMBER,
            message: 'Halo kak, orderan sudah kami serahkan ke kurir ya. Mohon ditunggu.',
            date_create: '21/07/2026 10:05:00',
        },
    ],
    '6289876543210@s.whatsapp.net': [
        {
            mobile_number_sender: ADMIN_NUMBER,
            message: 'Terima kasih telah berbelanja di toko kami!',
            date_create: '20/07/2026 15:30:00',
        }
    ]
};

export const MOCK_LOGS: MessageLog[] = [
    {
        id_message_wa: 100,
        mobile_number: '6281234567890@s.whatsapp.net',
        message: 'Halo kak, orderan sudah kami serahkan ke kurir ya. Mohon ditunggu.',
        memo: '-',
        date_create: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        date_update: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
        flag_status: 1, // Terkirim
    },
    {
        id_message_wa: 99,
        mobile_number: '6289876543210@s.whatsapp.net',
        message: 'Terima kasih telah berbelanja di toko kami!',
        memo: '-',
        date_create: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        date_update: null,
        flag_status: 0, // Belum Terkirim
    }
];
