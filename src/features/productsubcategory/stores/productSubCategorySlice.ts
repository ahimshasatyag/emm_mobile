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
            return await productSubCategoryApi.fetchSubCategories();
        } catch (error: any) {
            return rejectWithValue(error.message || 'Gagal memuat sub kategori');
        }
    }
);

export const createSubCategory = createAsyncThunk(
    'productSubCategory/create',
    async (data: ProductSubCategoryFormData, { rejectWithValue }) => {
        try {
            return await productSubCategoryApi.createSubCategory(data);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Gagal menambahkan sub kategori');
        }
    }
);

export const updateSubCategory = createAsyncThunk(
    'productSubCategory/update',
    async ({ id, data }: { id: string; data: Partial<ProductSubCategoryFormData> }, { rejectWithValue }) => {
        try {
            return await productSubCategoryApi.updateSubCategory(id, data);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Gagal mengubah sub kategori');
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
                state.successMessage = 'Sub Kategori berhasil ditambahkan';
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
                state.successMessage = 'Sub Kategori berhasil diperbarui';
                const index = state.data.findIndex(c => c.id_product_sub_kategori === action.payload.id_product_sub_kategori);
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
            })
            .addCase(updateSubCategory.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    }
});

export const { clearMessages } = productSubCategorySlice.actions;
export const productSubCategoryReducer = productSubCategorySlice.reducer;
