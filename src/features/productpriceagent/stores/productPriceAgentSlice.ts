import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { productPriceAgentApi } from '../api/api';
import { ProductPriceAgentProduct, ProductPriceAgentDetail, ProductPriceAgentOptions } from '../types/productpriceagent.types';

interface ProductPriceAgentState {
    products: ProductPriceAgentProduct[];
    selectedDetail: ProductPriceAgentDetail | null;
    options: ProductPriceAgentOptions | null;
    isLoading: boolean;
    isDetailLoading: boolean;
    error: string | null;
}

const initialState: ProductPriceAgentState = {
    products: [],
    selectedDetail: null,
    options: null,
    isLoading: false,
    isDetailLoading: false,
    error: null
};

export const fetchProducts = createAsyncThunk(
    'productPriceAgent/fetchProducts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await productPriceAgentApi.getProducts();
            if (response.status) {
                return response.data;
            }
            return rejectWithValue('Failed to fetch products');
        } catch (error: any) {
            return rejectWithValue(error.message || 'An error occurred');
        }
    }
);

export const fetchProductDetail = createAsyncThunk(
    'productPriceAgent/fetchProductDetail',
    async (id_product: string, { rejectWithValue }) => {
        try {
            const response = await productPriceAgentApi.getProductDetail(id_product);
            if (response.status) {
                return { detail: response.data, options: response.options };
            }
            return rejectWithValue(response.message || 'Data not found');
        } catch (error: any) {
            return rejectWithValue(error.message || 'An error occurred');
        }
    }
);

const productPriceAgentSlice = createSlice({
    name: 'productPriceAgent',
    initialState,
    reducers: {
        clearDetail: (state) => {
            state.selectedDetail = null;
            state.options = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetchProducts
            .addCase(fetchProducts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            
            // fetchProductDetail
            .addCase(fetchProductDetail.pending, (state) => {
                state.isDetailLoading = true;
                state.error = null;
            })
            .addCase(fetchProductDetail.fulfilled, (state, action) => {
                state.isDetailLoading = false;
                state.selectedDetail = action.payload.detail;
                state.options = action.payload.options;
            })
            .addCase(fetchProductDetail.rejected, (state, action) => {
                state.isDetailLoading = false;
                state.error = action.payload as string;
                state.selectedDetail = null;
                state.options = null;
            });
    }
});

export const { clearDetail } = productPriceAgentSlice.actions;
export default productPriceAgentSlice.reducer;
