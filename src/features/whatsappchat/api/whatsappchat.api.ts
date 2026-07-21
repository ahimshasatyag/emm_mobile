import { Contact, ChatMessage, MessageLog } from '../types/whatsappchat.types';
import { MOCK_CONTACTS, MOCK_MESSAGES, MOCK_LOGS, ADMIN_NUMBER } from '../data/whatsappchat.data';

let contacts = [...MOCK_CONTACTS];
let messages = { ...MOCK_MESSAGES };
let logs = [...MOCK_LOGS];

export const fetchContacts = async (): Promise<Contact[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([...contacts].sort((a, b) => new Date(b.date_create).getTime() - new Date(a.date_create).getTime()));
        }, 500);
    });
};

export const fetchMessages = async (contactNumber: string): Promise<ChatMessage[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const result = messages[contactNumber] || [];
            resolve([...result]);
        }, 500);
    });
};

export const sendMessage = async (mobile_number_receive: string, message: string): Promise<{ timestamp: number }> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const now = Date.now();
            
            // Generate readable date
            const d = new Date(now);
            const readableDate = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')}/${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;

            const newMsg: ChatMessage = {
                mobile_number_sender: ADMIN_NUMBER,
                message: message,
                date_create: readableDate,
            };

            if (!messages[mobile_number_receive]) {
                messages[mobile_number_receive] = [];
            }
            messages[mobile_number_receive].push(newMsg);

            // Update contact list
            const existingContactIndex = contacts.findIndex(c => c.number === mobile_number_receive);
            if (existingContactIndex >= 0) {
                contacts[existingContactIndex].date_create = new Date(now).toISOString();
            } else {
                contacts.push({ number: mobile_number_receive, date_create: new Date(now).toISOString() });
            }

            // Create Log
            const newLog: MessageLog = {
                id_message_wa: logs.length > 0 ? Math.max(...logs.map(l => l.id_message_wa)) + 1 : 1,
                mobile_number: mobile_number_receive,
                message: message,
                date_create: new Date(now).toISOString(),
                flag_status: 1, // mock as sent
            };
            logs.unshift(newLog);

            resolve({ timestamp: Math.floor(now / 1000) });
        }, 800);
    });
};

export const fetchLogs = async (): Promise<MessageLog[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([...logs]);
        }, 500);
    });
};
