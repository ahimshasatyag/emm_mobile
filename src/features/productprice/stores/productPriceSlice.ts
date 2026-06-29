import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ProductPriceState, ProductPriceFormData } from '../types/productprice.types';
import { productPriceApi } from '../api/api';

const initialState: ProductPriceState = {
    prices: [],
    isLoading: false,
    error: null,
};

export const fetchProductPrices = createAsyncThunk(
    'productPrice/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const data = await productPriceApi.getAll();
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch product prices');
        }
    }
);

export const createProductPrice = createAsyncThunk(
    'productPrice/create',
    async (data: ProductPriceFormData, { rejectWithValue }) => {
        try {
            const result = await productPriceApi.create(data);
            return result;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to create product price');
        }
    }
);

export const updateProductPrice = createAsyncThunk(
    'productPrice/update',
    async ({ id, data }: { id: string; data: ProductPriceFormData }, { rejectWithValue }) => {
        try {
            const result = await productPriceApi.update(id, data);
            return result;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to update product price');
        }
    }
);

const productPriceSlice = createSlice({
    name: 'productPrice',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch All
            .addCase(fetchProductPrices.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchProductPrices.fulfilled, (state, action) => {
                state.isLoading = false;
                state.prices = action.payload;
            })
            .addCase(fetchProductPrices.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            
            // Create
            .addCase(createProductPrice.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createProductPrice.fulfilled, (state, action) => {
                state.isLoading = false;
                state.prices.unshift(action.payload);
            })
            .addCase(createProductPrice.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            // Update
            .addCase(updateProductPrice.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateProductPrice.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.prices.findIndex(p => p.id_product === action.payload.id_product);
                if (index !== -1) {
                    state.prices[index] = action.payload;
                }
            })
            .addCase(updateProductPrice.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    }
});

export const { clearError } = productPriceSlice.actions;
export default productPriceSlice.reducer;
