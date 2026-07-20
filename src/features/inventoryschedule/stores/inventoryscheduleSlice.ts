import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { InventorySchedule, AssetItem, UserItem } from '../types/inventoryschedule.types';
import * as api from '../api/inventoryscheduleApi';

interface InventoryScheduleState {
    schedules: InventorySchedule[];
    assets: AssetItem[];
    users: UserItem[];
    loading: boolean;
    error: string | null;
}

const initialState: InventoryScheduleState = {
    schedules: [],
    assets: [],
    users: [],
    loading: false,
    error: null,
};

export const fetchSchedulesList = createAsyncThunk(
    'inventoryschedule/fetchSchedules',
    async (_, { rejectWithValue }) => {
        try {
            const data = await api.fetchSchedules();
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch schedules');
        }
    }
);

export const fetchAssetsList = createAsyncThunk(
    'inventoryschedule/fetchAssets',
    async (_, { rejectWithValue }) => {
        try {
            const data = await api.fetchAssets();
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch assets');
        }
    }
);

export const fetchUsersList = createAsyncThunk(
    'inventoryschedule/fetchUsers',
    async (_, { rejectWithValue }) => {
        try {
            const data = await api.fetchUsers();
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch users');
        }
    }
);

const inventoryScheduleSlice = createSlice({
    name: 'inventoryschedule',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSchedulesList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSchedulesList.fulfilled, (state, action: PayloadAction<InventorySchedule[]>) => {
                state.loading = false;
                state.schedules = action.payload;
            })
            .addCase(fetchSchedulesList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchAssetsList.fulfilled, (state, action: PayloadAction<AssetItem[]>) => {
                state.assets = action.payload;
            })
            .addCase(fetchUsersList.fulfilled, (state, action: PayloadAction<UserItem[]>) => {
                state.users = action.payload;
            });
    },
});

export default inventoryScheduleSlice.reducer;
