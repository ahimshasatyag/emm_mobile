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
            return await productCategoryApi.fetchCategories();
        } catch (error: any) {
            return rejectWithValue(error.message || 'Gagal memuat kategori');
        }
    }
);

export const createCategory = createAsyncThunk(
    'productCategory/create',
    async (data: ProductCategoryFormData, { rejectWithValue }) => {
        try {
            return await productCategoryApi.createCategory(data);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Gagal menyimpan kategori');
        }
    }
);

export const updateCategory = createAsyncThunk(
    'productCategory/update',
    async ({ id, data }: { id: string, data: Partial<ProductCategoryFormData> }, { rejectWithValue }) => {
        try {
            return await productCategoryApi.updateCategory(id, data);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Gagal mengubah kategori');
        }
    }
);

export const deleteCategory = createAsyncThunk(
    'productCategory/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            await productCategoryApi.deleteCategory(id);
            return id;
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
                state.successMessage = 'Kategori berhasil ditambahkan';
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
                state.successMessage = 'Kategori berhasil diubah';
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
