import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { InventorySchedule, AssetItem, UserItem, ScheduleSavePayload } from '../types/inventoryschedule.types';
import * as api from '../api/inventoryscheduleApi';

interface InventoryScheduleState {
    schedules: InventorySchedule[];
    assets: AssetItem[];
    users: UserItem[];
    loading: boolean;
    isSaving: boolean;
    error: string | null;
}

const initialState: InventoryScheduleState = {
    schedules: [],
    assets: [],
    users: [],
    loading: false,
    isSaving: false,
    error: null,
};

export const loadScheduleData = createAsyncThunk(
    'inventoryschedule/loadData',
    async (_, { rejectWithValue }) => {
        try {
            const [schedules, supportData] = await Promise.all([
                api.fetchSchedules(),
                api.fetchScheduleSupportData()
            ]);
            return {
                schedules,
                assets: supportData.assets,
                users: supportData.users
            };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to load schedule data');
        }
    }
);

export const submitSchedule = createAsyncThunk(
    'inventoryschedule/submit',
    async ({ id, payload }: { id?: string | null, payload: ScheduleSavePayload }, { dispatch, rejectWithValue }) => {
        try {
            const response = await api.saveSchedule(id, payload);
            if (response && response.status) {
                // Reload list to get the updated records from backend
                dispatch(loadScheduleData());
            }
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to save schedule');
        }
    }
);

const inventoryScheduleSlice = createSlice({
    name: 'inventoryschedule',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadScheduleData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadScheduleData.fulfilled, (state, action) => {
                state.loading = false;
                state.schedules = action.payload.schedules;
                state.assets = action.payload.assets;
                state.users = action.payload.users;
            })
            .addCase(loadScheduleData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(submitSchedule.pending, (state) => {
                state.isSaving = true;
                state.error = null;
            })
            .addCase(submitSchedule.fulfilled, (state) => {
                state.isSaving = false;
            })
            .addCase(submitSchedule.rejected, (state, action) => {
                state.isSaving = false;
                state.error = action.payload as string;
            });
    },
});

export default inventoryScheduleSlice.reducer;
