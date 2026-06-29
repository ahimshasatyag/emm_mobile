import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ProductBrand, ProductBrandFormData } from '../types/productbrand.types';
import { productBrandApi } from '../api/productBrandApi';

interface ProductBrandState {
    data: ProductBrand[];
    isLoading: boolean;
    error: string | null;
    successMessage: string | null;
}

const initialState: ProductBrandState = {
    data: [],
    isLoading: false,
    error: null,
    successMessage: null
};

export const fetchBrands = createAsyncThunk(
    'productBrand/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await productBrandApi.getAll();
        } catch (error: any) {
            return rejectWithValue(error.message || 'Gagal memuat merek produk');
        }
    }
);

export const createBrand = createAsyncThunk(
    'productBrand/create',
    async (data: ProductBrandFormData, { rejectWithValue }) => {
        try {
            return await productBrandApi.create(data);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Gagal menambahkan merek produk');
        }
    }
);

export const updateBrand = createAsyncThunk(
    'productBrand/update',
    async ({ id, data }: { id: string; data: Partial<ProductBrandFormData> }, { rejectWithValue }) => {
        try {
            return await productBrandApi.update(id, data);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Gagal memperbarui merek produk');
        }
    }
);

export const deleteBrand = createAsyncThunk(
    'productBrand/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            await productBrandApi.delete(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Gagal menghapus merek produk');
        }
    }
);

const productBrandSlice = createSlice({
    name: 'productBrand',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccessMessage: (state) => {
            state.successMessage = null;
        },
        clearMessages: (state) => {
            state.error = null;
            state.successMessage = null;
        }
    },
    extraReducers: (builder) => {
        // Fetch
        builder.addCase(fetchBrands.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchBrands.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;
        });
        builder.addCase(fetchBrands.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Create
        builder.addCase(createBrand.pending, (state) => {
            state.isLoading = true;
            state.error = null;
            state.successMessage = null;
        });
        builder.addCase(createBrand.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data.push(action.payload);
            state.successMessage = 'Merek produk berhasil ditambahkan';
        });
        builder.addCase(createBrand.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Update
        builder.addCase(updateBrand.pending, (state) => {
            state.isLoading = true;
            state.error = null;
            state.successMessage = null;
        });
        builder.addCase(updateBrand.fulfilled, (state, action) => {
            state.isLoading = false;
            const index = state.data.findIndex(item => item.id_product_brand === action.payload.id_product_brand);
            if (index !== -1) {
                state.data[index] = action.payload;
            }
            state.successMessage = 'Merek produk berhasil diperbarui';
        });
        builder.addCase(updateBrand.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Delete
        builder.addCase(deleteBrand.pending, (state) => {
            state.isLoading = true;
            state.error = null;
            state.successMessage = null;
        });
        builder.addCase(deleteBrand.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = state.data.filter(item => item.id_product_brand !== action.payload);
            state.successMessage = 'Merek produk berhasil dihapus';
        });
        builder.addCase(deleteBrand.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });
    }
});

export const { clearError, clearSuccessMessage, clearMessages } = productBrandSlice.actions;
export default productBrandSlice.reducer;
