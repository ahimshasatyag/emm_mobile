import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { LogbookProduct, LogbookProductState } from '../types/logbookproduct.types';
import { logbookProductApi } from '../api/logbookProductApi';
import { dummyLogbookProducts } from '../data/dummyProducts';

const initialState: LogbookProductState = {
    list: [],
    current: null,
    isLoading: false,
    error: null,
};

export const fetchLogbookProducts = createAsyncThunk(
    'logbookproduct/fetchList',
    async () => {
        // In real implementation: return await logbookProductApi.getAll();
        return new Promise<LogbookProduct[]>((resolve) => {
            setTimeout(() => {
                resolve(dummyLogbookProducts);
            }, 800);
        });
    }
);

export const fetchLogbookProductDetail = createAsyncThunk(
    'logbookproduct/fetchDetail',
    async (id: string) => {
        // In real implementation: return await logbookProductApi.getById(id);
        return new Promise<LogbookProduct | null>((resolve) => {
            setTimeout(() => {
                const found = dummyLogbookProducts.find(item => item.id_log_book === id);
                resolve(found || null);
            }, 500);
        });
    }
);

const logbookProductSlice = createSlice({
    name: 'logbookproduct',
    initialState,
    reducers: {
        clearCurrent: (state) => {
            state.current = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLogbookProducts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchLogbookProducts.fulfilled, (state, action: PayloadAction<LogbookProduct[]>) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(fetchLogbookProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch';
            })
            .addCase(fetchLogbookProductDetail.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchLogbookProductDetail.fulfilled, (state, action: PayloadAction<LogbookProduct | null>) => {
                state.isLoading = false;
                state.current = action.payload;
            });
    }
});

export const { clearCurrent } = logbookProductSlice.actions;
export default logbookProductSlice.reducer;
