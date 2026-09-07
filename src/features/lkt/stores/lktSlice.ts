import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Lkt, LktDetail, LktFilter, TeknisiOption } from '../types/lkt.types';
import { lktApi } from '../api/lkt.api';

interface LktState {
    items: Lkt[];
    currentLkt: LktDetail | null;
    teknisiOptions: TeknisiOption[];
    isLoading: boolean;
    error: string | null;
    filter: LktFilter;
}

const initialState: LktState = {
    items: [],
    currentLkt: null,
    teknisiOptions: [],
    isLoading: false,
    error: null,
    filter: {
        statusFilter: 'ALL',
        isAll: true,
        searchQuery: ''
    }
};

// ===== Async Thunks =====
export const fetchLkts = createAsyncThunk('lkt/fetchAll', async () => {
    return await lktApi.getAll();
});

export const fetchLktById = createAsyncThunk('lkt/fetchById', async (id: string) => {
    return await lktApi.getById(id);
});

export const createLkt = createAsyncThunk('lkt/create', async (payload: any) => {
    return await lktApi.create(payload);
});

export const updateLkt = createAsyncThunk('lkt/update', async ({ id, payload }: { id: string; payload: any }) => {
    return await lktApi.update(id, payload);
});

export const doneLkt = createAsyncThunk('lkt/done', async ({ id, payload }: { id: string; payload: any }) => {
    return await lktApi.done(id, payload);
});

export const cancelLkt = createAsyncThunk('lkt/cancel', async ({ id, payload }: { id: string; payload: any }) => {
    return await lktApi.cancel(id, payload);
});

export const fetchTeknisiOptions = createAsyncThunk('lkt/teknisiOptions', async () => {
    return await lktApi.getTeknisiOptions();
});

export const createRealisasi = createAsyncThunk('lkt/createRealisasi', async ({ lktId, payload }: { lktId: string; payload: any }) => {
    return await lktApi.storeRealisasi(lktId, payload);
});

export const updateRealisasi = createAsyncThunk('lkt/updateRealisasi', async ({ lktSubCode, payload }: { lktSubCode: string; payload: any }) => {
    return await lktApi.updateRealisasi(lktSubCode, payload);
});

export const confirmRealisasi = createAsyncThunk('lkt/confirmRealisasi', async ({ lktSubCode, payload }: { lktSubCode: string; payload?: any }) => {
    return await lktApi.confirmRealisasi(lktSubCode, payload);
});

export const closeRealisasi = createAsyncThunk('lkt/closeRealisasi', async ({ lktSubCode, payload }: { lktSubCode: string; payload?: any }) => {
    return await lktApi.closeRealisasi(lktSubCode, payload);
});

export const cancelRealisasi = createAsyncThunk('lkt/cancelRealisasi', async ({ lktSubCode, payload }: { lktSubCode: string; payload?: any }) => {
    return await lktApi.cancelRealisasi(lktSubCode, payload);
});

export const rejectRealisasi = createAsyncThunk('lkt/rejectRealisasi', async ({ lktSubCode, payload }: { lktSubCode: string; payload?: any }) => {
    return await lktApi.rejectRealisasi(lktSubCode, payload);
});

// ===== Slice =====
const lktSlice = createSlice({
    name: 'lkt',
    initialState,
    reducers: {
        setFilter: (state, action: PayloadAction<Partial<LktFilter>>) => {
            state.filter = { ...state.filter, ...action.payload };
        },
        clearCurrentLkt: (state) => {
            state.currentLkt = null;
        },
    },
    extraReducers: (builder) => {
        // fetchLkts
        builder.addCase(fetchLkts.pending, (state) => { state.isLoading = true; state.error = null; });
        builder.addCase(fetchLkts.fulfilled, (state, action) => { state.isLoading = false; state.items = action.payload; });
        builder.addCase(fetchLkts.rejected, (state, action) => { state.isLoading = false; state.error = action.error.message || 'Error'; });

        // fetchLktById
        builder.addCase(fetchLktById.pending, (state) => { state.isLoading = true; state.error = null; });
        builder.addCase(fetchLktById.fulfilled, (state, action) => { state.isLoading = false; state.currentLkt = action.payload; });
        builder.addCase(fetchLktById.rejected, (state, action) => { state.isLoading = false; state.error = action.error.message || 'Error'; });

        // fetchTeknisiOptions
        builder.addCase(fetchTeknisiOptions.fulfilled, (state, action) => { state.teknisiOptions = action.payload; });

        // All mutation thunks - just set loading
        const mutationThunks = [createLkt, updateLkt, doneLkt, cancelLkt, createRealisasi, updateRealisasi, confirmRealisasi, closeRealisasi, cancelRealisasi, rejectRealisasi];
        mutationThunks.forEach((thunk: any) => {
            builder.addCase(thunk.pending, (state) => { state.isLoading = true; state.error = null; });
            builder.addCase(thunk.fulfilled, (state) => { state.isLoading = false; });
            builder.addCase(thunk.rejected, (state, action: any) => { state.isLoading = false; state.error = action.error.message || 'Error'; });
        });
    }
});

export const { setFilter, clearCurrentLkt } = lktSlice.actions;
export default lktSlice.reducer;
