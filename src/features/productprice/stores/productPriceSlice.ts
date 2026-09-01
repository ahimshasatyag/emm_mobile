import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ProductPriceState, ProductPriceFormData } from '../types/productprice.types';
import { productPriceApi } from '../api/api';

const initialState: ProductPriceState = {
    prices: [],
    supportData: null,
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
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch product prices');
        }
    }
);

export const fetchSupportData = createAsyncThunk(
    'productPrice/fetchSupportData',
    async (_, { rejectWithValue }) => {
        try {
            const data = await productPriceApi.getSupportData();
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch support data');
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
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to create product price');
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
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update product price');
        }
    }
);

export const deleteProductPrice = createAsyncThunk(
    'productPrice/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            await productPriceApi.delete(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete product price');
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
            
            // Fetch Support Data
            .addCase(fetchSupportData.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchSupportData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.supportData = action.payload;
            })
            .addCase(fetchSupportData.rejected, (state, action) => {
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
                // Sometimes create endpoint doesn't return full relation, but let's push it anyway. It will be refreshed.
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
                    state.prices[index] = {
                        ...state.prices[index],
                        ...action.payload
                    };
                }
            })
            .addCase(updateProductPrice.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            
            // Delete
            .addCase(deleteProductPrice.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteProductPrice.fulfilled, (state, action) => {
                state.isLoading = false;
                state.prices = state.prices.filter(p => p.id_product !== action.payload);
            })
            .addCase(deleteProductPrice.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    }
});

export const { clearError } = productPriceSlice.actions;
export default productPriceSlice.reducer;
