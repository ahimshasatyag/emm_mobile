import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { SalesRetur } from '../types/salesretur.types';
import { salesReturApi } from '../api/salesreturApi';

interface SalesReturState {
    items: SalesRetur[];
    currentRetur: SalesRetur | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: SalesReturState = {
    items: [],
    currentRetur: null,
    isLoading: false,
    error: null,
};

export const fetchSalesReturs = createAsyncThunk(
    'salesretur/fetchAll',
    async () => {
        const response = await salesReturApi.getSalesReturs();
        return response.data;
    }
);

export const fetchSalesReturById = createAsyncThunk(
    'salesretur/fetchById',
    async (id: string) => {
        const response = await salesReturApi.getSalesReturById(id);
        return response.data;
    }
);

const salesReturSlice = createSlice({
    name: 'salesretur',
    initialState,
    reducers: {
        clearCurrentRetur: (state) => {
            state.currentRetur = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch All
            .addCase(fetchSalesReturs.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchSalesReturs.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(fetchSalesReturs.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch sales returs';
            })
            // Fetch By ID
            .addCase(fetchSalesReturById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.currentRetur = null;
            })
            .addCase(fetchSalesReturById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentRetur = action.payload;
            })
            .addCase(fetchSalesReturById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch sales retur details';
            });
    }
});

export const { clearCurrentRetur } = salesReturSlice.actions;
export default salesReturSlice.reducer;
