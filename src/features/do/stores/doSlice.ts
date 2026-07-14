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
    async ({ id, action }: { id: string, action: string }, { rejectWithValue }) => {
        try {
            const success = await doApi.submitAction(id, action);
            if (success) {
                return { id, action };
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
