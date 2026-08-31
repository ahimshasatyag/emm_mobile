import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ProductSubCategoryState, ProductSubCategoryFormData } from '../types/productsubcategory.types';
import { productSubCategoryApi } from '../api/productSubCategoryApi';

const initialState: ProductSubCategoryState = {
    data: [],
    isLoading: false,
    error: null,
    successMessage: null,
};

export const fetchSubCategories = createAsyncThunk(
    'productSubCategory/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await productSubCategoryApi.fetchSubCategories();
            if (response.success && response.data) {
                return response.data;
            }
            return rejectWithValue(response.message || 'Gagal memuat sub kategori');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Gagal memuat sub kategori');
        }
    }
);

export const createSubCategory = createAsyncThunk(
    'productSubCategory/create',
    async (data: ProductSubCategoryFormData, { rejectWithValue }) => {
        try {
            const response = await productSubCategoryApi.createSubCategory(data);
            if (response.success && response.data) {
                return response.data;
            }
            return rejectWithValue(response.message || 'Gagal menambahkan sub kategori');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Gagal menambahkan sub kategori');
        }
    }
);

export const updateSubCategory = createAsyncThunk(
    'productSubCategory/update',
    async ({ id, data }: { id: string; data: Partial<ProductSubCategoryFormData> }, { rejectWithValue }) => {
        try {
            const response = await productSubCategoryApi.updateSubCategory(id, data);
            if (response.success && response.data) {
                return response.data;
            }
            return rejectWithValue(response.message || 'Gagal mengubah sub kategori');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Gagal mengubah sub kategori');
        }
    }
);

export const deleteSubCategory = createAsyncThunk(
    'productSubCategory/delete',
    async (id: string | number, { rejectWithValue }) => {
        try {
            const response = await productSubCategoryApi.deleteSubCategory(id);
            if (response.success) {
                return id;
            }
            return rejectWithValue(response.message || 'Gagal menghapus sub kategori');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Gagal menghapus sub kategori');
        }
    }
);

const productSubCategorySlice = createSlice({
    name: 'productSubCategory',
    initialState,
    reducers: {
        clearMessages: (state) => {
            state.error = null;
            state.successMessage = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchSubCategories.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchSubCategories.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(fetchSubCategories.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Create
            .addCase(createSubCategory.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createSubCategory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data.unshift(action.payload);
            })
            .addCase(createSubCategory.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Update
            .addCase(updateSubCategory.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateSubCategory.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.data.findIndex(c => c.id_product_sub_kategori === action.payload.id_product_sub_kategori);
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
            })
            .addCase(updateSubCategory.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Delete
            .addCase(deleteSubCategory.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteSubCategory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = state.data.filter(c => String(c.id_product_sub_kategori) !== String(action.payload));
                state.successMessage = 'Sub Kategori berhasil dihapus';
            })
            .addCase(deleteSubCategory.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    }
});

export const { clearMessages } = productSubCategorySlice.actions;
export const productSubCategoryReducer = productSubCategorySlice.reducer;
