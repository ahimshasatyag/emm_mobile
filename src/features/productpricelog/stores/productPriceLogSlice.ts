import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ProductPriceLog } from '../types/productpricelog.types';
import { productPriceLogApi } from '../api/api';

interface ProductPriceLogState {
    logs: ProductPriceLog[];
    isLoading: boolean;
    error: string | null;
}

const initialState: ProductPriceLogState = {
    logs: [],
    isLoading: false,
    error: null,
};

export const fetchLogs = createAsyncThunk(
    'productPriceLog/fetchLogs',
    async (_, { rejectWithValue }) => {
        try {
            return await productPriceLogApi.getLogs();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const productPriceLogSlice = createSlice({
    name: 'productPriceLog',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchLogs.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchLogs.fulfilled, (state, action: PayloadAction<ProductPriceLog[]>) => {
            state.isLoading = false;
            state.logs = action.payload || [];
        });
        builder.addCase(fetchLogs.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });
    }
});

export const { clearError } = productPriceLogSlice.actions;
export default productPriceLogSlice.reducer;
