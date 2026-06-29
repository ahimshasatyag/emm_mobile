import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ProductData, CategoryOption, SubCategoryOption, BrandOption, SatuanOption } from '../types/products.types';
import { productsApi } from '../api/products.api';

interface ProductsState {
    products: ProductData[];
    categories: CategoryOption[];
    subCategories: SubCategoryOption[];
    brands: BrandOption[];
    satuans: SatuanOption[];
    loading: boolean;
    error: string | null;
}

const initialState: ProductsState = {
    products: [],
    categories: [],
    subCategories: [],
    brands: [],
    satuans: [],
    loading: false,
    error: null,
};

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async () => {
        return await productsApi.fetchProducts();
    }
);

export const fetchCategories = createAsyncThunk(
    'products/fetchCategories',
    async () => {
        return await productsApi.fetchCategories();
    }
);

export const fetchSubCategories = createAsyncThunk(
    'products/fetchSubCategories',
    async (categoryId: string) => {
        return await productsApi.fetchSubCategories(categoryId);
    }
);

export const fetchBrands = createAsyncThunk(
    'products/fetchBrands',
    async () => {
        return await productsApi.fetchBrands();
    }
);

export const fetchSatuans = createAsyncThunk(
    'products/fetchSatuans',
    async () => {
        return await productsApi.fetchSatuans();
    }
);

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        clearProductsError: (state) => {
            state.error = null;
        },
        clearSubCategories: (state) => {
            state.subCategories = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch products';
            })
            // Options Reducers
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categories = action.payload;
            })
            .addCase(fetchSubCategories.fulfilled, (state, action) => {
                state.subCategories = action.payload;
            })
            .addCase(fetchBrands.fulfilled, (state, action) => {
                state.brands = action.payload;
            })
            .addCase(fetchSatuans.fulfilled, (state, action) => {
                state.satuans = action.payload;
            });
    },
});

export const { clearProductsError, clearSubCategories } = productsSlice.actions;
export default productsSlice.reducer;
