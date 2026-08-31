import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ProductCategoryData, ProductCategoryFormData } from '../types/productcategory.types';
import { productCategoryApi } from '../api/productCategoryApi';

interface ProductCategoryState {
    categories: ProductCategoryData[];
    loading: boolean;
    error: string | null;
    successMessage: string | null;
}

const initialState: ProductCategoryState = {
    categories: [],
    loading: false,
    error: null,
    successMessage: null
};

export const fetchCategories = createAsyncThunk(
    'productCategory/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await productCategoryApi.fetchCategories();
            if (response.success && response.data) {
                return response.data;
            }
            return rejectWithValue(response.message || 'Gagal memuat kategori');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Gagal memuat kategori');
        }
    }
);

export const createCategory = createAsyncThunk(
    'productCategory/create',
    async (data: ProductCategoryFormData, { rejectWithValue }) => {
        try {
            const response = await productCategoryApi.createCategory(data);
            if (response.success && response.data) {
                return response.data;
            }
            return rejectWithValue(response.message || 'Gagal menyimpan kategori');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Gagal menyimpan kategori');
        }
    }
);

export const updateCategory = createAsyncThunk(
    'productCategory/update',
    async ({ id, data }: { id: string | number, data: Partial<ProductCategoryFormData> }, { rejectWithValue }) => {
        try {
            const response = await productCategoryApi.updateCategory(id, data);
            if (response.success && response.data) {
                return response.data;
            }
            return rejectWithValue(response.message || 'Gagal mengubah kategori');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Gagal mengubah kategori');
        }
    }
);

export const deleteCategory = createAsyncThunk(
    'productCategory/delete',
    async (id: string | number, { rejectWithValue }) => {
        try {
            const response = await productCategoryApi.deleteCategory(id);
            if (response.success) {
                return id;
            }
            return rejectWithValue(response.message || 'Gagal menghapus kategori');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Gagal menghapus kategori');
        }
    }
);

const productCategorySlice = createSlice({
    name: 'productCategory',
    initialState,
    reducers: {
        clearError: (state) => { state.error = null; },
        clearSuccessMessage: (state) => { state.successMessage = null; }
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Create
            .addCase(createCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.categories.push(action.payload);
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update
            .addCase(updateCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.categories.findIndex(c => c.id_product_kategori === action.payload.id_product_kategori);
                if (index !== -1) {
                    state.categories[index] = action.payload;
                }
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Delete
            .addCase(deleteCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = state.categories.filter(c => c.id_product_kategori !== action.payload);
                state.successMessage = 'Kategori berhasil dihapus';
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const { clearError, clearSuccessMessage } = productCategorySlice.actions;
export default productCategorySlice.reducer;
