import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ProductPriceMktState } from '../types/productpricemkt.types';
import { productPriceMktApi } from '../api/api';

const initialState: ProductPriceMktState = {
    products: [],
    selectedDetail: null,
    options: [],
    isLoading: false,
    isDetailLoading: false,
    error: null,
};

export const fetchProductPriceMktProducts = createAsyncThunk(
    'productPriceMkt/fetchProducts',
    async (_, { rejectWithValue }) => {
        try {
            return await productPriceMktApi.getProducts();
        } catch (error: any) {
            return rejectWithValue(error.message || 'Gagal memuat data produk');
        }
    }
);

export const fetchProductPriceMktDetail = createAsyncThunk(
    'productPriceMkt/fetchDetail',
    async (id_product: string, { rejectWithValue }) => {
        try {
            const result = await productPriceMktApi.getDetail(id_product);
            if (!result) return rejectWithValue('Produk tidak ditemukan');
            return result;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Gagal memuat detail produk');
        }
    }
);

const productPriceMktSlice = createSlice({
    name: 'productPriceMkt',
    initialState,
    reducers: {
        clearDetail: (state) => {
            state.selectedDetail = null;
            state.options = [];
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Products
            .addCase(fetchProductPriceMktProducts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchProductPriceMktProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.products = action.payload;
            })
            .addCase(fetchProductPriceMktProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            // Fetch Detail
            .addCase(fetchProductPriceMktDetail.pending, (state) => {
                state.isDetailLoading = true;
                state.selectedDetail = null;
                state.options = [];
                state.error = null;
            })
            .addCase(fetchProductPriceMktDetail.fulfilled, (state, action) => {
                state.isDetailLoading = false;
                state.selectedDetail = action.payload.detail;
                state.options = action.payload.options;
            })
            .addCase(fetchProductPriceMktDetail.rejected, (state, action) => {
                state.isDetailLoading = false;
                state.error = action.payload as string;
            });
    }
});

export const { clearDetail, clearError } = productPriceMktSlice.actions;
export default productPriceMktSlice.reducer;
