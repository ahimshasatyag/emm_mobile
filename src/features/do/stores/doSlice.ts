import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { DoState, DoItem, DoDetail } from '../types/do.types';
import { doApi } from '../api/doApi';

const initialState: DoState = {
    list: [],
    detail: null,
    loading: false,
    loadingDetail: false,
    error: null,
};

export const fetchDoList = createAsyncThunk(
    'do/fetchList',
    async (_, { rejectWithValue }) => {
        try {
            const data = await doApi.getDoList();
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Gagal memuat daftar DO');
        }
    }
);

export const fetchDoDetail = createAsyncThunk(
    'do/fetchDetail',
    async (id: string, { rejectWithValue }) => {
        try {
            const data = await doApi.getDoDetail(id);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Gagal memuat detail DO');
        }
    }
);

export const submitDoAction = createAsyncThunk(
    'do/submitAction',
    async ({ id, action, payload }: { id: string, action: string, payload?: any }, { rejectWithValue }) => {
        try {
            let success = false;
            switch (action) {
                case 'CONFIRM':
                    success = await doApi.confirmDo(id);
                    break;
                case 'PAYMENT':
                    success = await doApi.checkPaymentDo(id);
                    break;
                case 'AVAILABILITY':
                    success = await doApi.checkAvailabilityDo(id);
                    break;
                case 'DELIVERED':
                    success = await doApi.deliveredDo(id);
                    break;
                case 'CANCEL':
                    success = await doApi.cancelDo(id, payload?.alasan || '', payload?.username);
                    break;
                case 'SPLIT':
                    success = await doApi.splitDo(id, payload?.details || []);
                    break;
                case 'REVISI':
                    success = await doApi.revisiDo(id);
                    break;
                case 'UPDATE':
                    success = await doApi.updateDo(id, payload);
                    break;
                default:
                    throw new Error('Unknown action');
            }
            
            if (success) {
                return { id, action, payload };
            }
            return rejectWithValue('Gagal memproses aksi');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Gagal memproses aksi');
        }
    }
);

const doSlice = createSlice({
    name: 'do',
    initialState,
    reducers: {
        clearDetail: (state) => {
            state.detail = null;
        }
    },
    extraReducers: (builder) => {
        // Fetch List
        builder.addCase(fetchDoList.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchDoList.fulfilled, (state, action: PayloadAction<DoItem[]>) => {
            state.loading = false;
            state.list = action.payload;
        });
        builder.addCase(fetchDoList.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Fetch Detail
        builder.addCase(fetchDoDetail.pending, (state) => {
            state.loadingDetail = true;
            state.error = null;
        });
        builder.addCase(fetchDoDetail.fulfilled, (state, action: PayloadAction<DoDetail>) => {
            state.loadingDetail = false;
            state.detail = action.payload;
        });
        builder.addCase(fetchDoDetail.rejected, (state, action) => {
            state.loadingDetail = false;
            state.error = action.payload as string;
        });
    }
});

export const { clearDetail } = doSlice.actions;
export default doSlice.reducer;
