import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { BrosurProduct } from '../types/brosur.types';
import { brosurApi } from '../api/api';

interface BrosurState {
    availableProducts: BrosurProduct[];
    isLoading: boolean;
    error: string | null;
}

const initialState: BrosurState = {
    availableProducts: [],
    isLoading: false,
    error: null,
};

export const fetchBrosurProducts = createAsyncThunk(
    'brosur/fetchProducts',
    async (_, { rejectWithValue }) => {
        try {
            const data = await brosurApi.getBrosurProducts();
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Gagal memuat produk brosur');
        }
    }
);

const brosurSlice = createSlice({
    name: 'brosur',
    initialState,
    reducers: {
        clearBrosurData: (state) => {
            state.availableProducts = [];
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBrosurProducts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchBrosurProducts.fulfilled, (state, action: PayloadAction<BrosurProduct[]>) => {
                state.isLoading = false;
                state.availableProducts = action.payload;
            })
            .addCase(fetchBrosurProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    }
});

export const { clearBrosurData } = brosurSlice.actions;
export default brosurSlice.reducer;
