import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Contact, ChatMessage, MessageLog } from '../types/whatsappchat.types';
import * as api from '../api/whatsappchat.api';

interface WhatsappChatState {
    contacts: Contact[];
    activeMessages: ChatMessage[];
    logs: MessageLog[];
    loading: boolean;
    sending: boolean;
    error: string | null;
}

const initialState: WhatsappChatState = {
    contacts: [],
    activeMessages: [],
    logs: [],
    loading: false,
    sending: false,
    error: null,
};

export const fetchContacts = createAsyncThunk('whatsappchat/fetchContacts', async () => {
    return await api.fetchContacts();
});

export const fetchMessages = createAsyncThunk('whatsappchat/fetchMessages', async (contactNumber: string) => {
    return await api.fetchMessages(contactNumber);
});

export const fetchLogs = createAsyncThunk('whatsappchat/fetchLogs', async () => {
    return await api.fetchLogs();
});

export const sendMessage = createAsyncThunk('whatsappchat/sendMessage', async (data: { mobile_number_receive: string; message: string }) => {
    const response = await api.sendMessage(data.mobile_number_receive, data.message);
    return { ...data, timestamp: response.timestamp };
});

const whatsappchatSlice = createSlice({
    name: 'whatsappchat',
    initialState,
    reducers: {
        clearActiveMessages: (state) => {
            state.activeMessages = [];
        }
    },
    extraReducers: (builder) => {
        // Fetch Contacts
        builder.addCase(fetchContacts.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchContacts.fulfilled, (state, action) => {
            state.loading = false;
            state.contacts = action.payload;
        });
        builder.addCase(fetchContacts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch contacts';
        });

        // Fetch Messages
        builder.addCase(fetchMessages.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchMessages.fulfilled, (state, action) => {
            state.loading = false;
            state.activeMessages = action.payload;
        });
        builder.addCase(fetchMessages.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch messages';
        });

        // Fetch Logs
        builder.addCase(fetchLogs.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchLogs.fulfilled, (state, action) => {
            state.loading = false;
            state.logs = action.payload;
        });
        builder.addCase(fetchLogs.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch logs';
        });

        // Send Message
        builder.addCase(sendMessage.pending, (state) => {
            state.sending = true;
            state.error = null;
        });
        builder.addCase(sendMessage.fulfilled, (state) => {
            state.sending = false;
        });
        builder.addCase(sendMessage.rejected, (state, action) => {
            state.sending = false;
            state.error = action.error.message || 'Failed to send message';
        });
    },
});

export const { clearActiveMessages } = whatsappchatSlice.actions;
export default whatsappchatSlice.reducer;
