import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Notification } from '../types/notification';
import { notificationService } from '../services/notification/notificationService';

interface NotificationState {
    notifications: Notification[];
    loading: boolean;
    error: string | null;
}

const initialState: NotificationState = {
    notifications: [],
    loading: false,
    error: null,
};

export const fetchNotifications = createAsyncThunk(
    'notification/fetchAll',
    async (user_id: number | undefined, { rejectWithValue }) => {
        try {
            const response = await notificationService.getAll(user_id);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Gagal memuat notifikasi');
        }
    }
);

export const markAsRead = createAsyncThunk(
    'notification/markAsRead',
    async (id: number, { rejectWithValue }) => {
        try {
            await notificationService.update(id, { is_read: 1 });
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Gagal mengubah status notifikasi');
        }
    }
);

export const markAllAsRead = createAsyncThunk(
    'notification/markAllAsRead',
    async (user_id: number, { rejectWithValue }) => {
        try {
            await notificationService.markAllAsRead(user_id);
            return true;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Gagal mengubah status semua notifikasi');
        }
    }
);

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(markAsRead.fulfilled, (state, action) => {
                const id = action.payload;
                const index = state.notifications.findIndex(n => n.id_notifikasi === id);
                if (index !== -1) {
                    state.notifications[index].is_read = 1;
                }
            })
            .addCase(markAllAsRead.fulfilled, (state) => {
                state.notifications.forEach(n => {
                    n.is_read = 1;
                });
            });
    }
});

export default notificationSlice.reducer;
