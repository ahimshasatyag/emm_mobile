import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ProductUnit, ProductUnitFormData } from '../types/productunit.types';
import { productUnitApi } from '../api/productUnitApi';

interface ProductUnitState {
    units: ProductUnit[];
    isLoading: boolean;
    error: string | null;
    successMessage: string | null;
}

const initialState: ProductUnitState = {
    units: [],
    isLoading: false,
    error: null,
    successMessage: null,
};

export const fetchUnits = createAsyncThunk(
    'productUnit/fetchUnits',
    async (_, { rejectWithValue }) => {
        try {
            const response = await productUnitApi.getUnits();
            if (response.success && response.data) {
                return response.data;
            }
            return rejectWithValue(response.message || 'Gagal memuat satuan');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Terjadi kesalahan');
        }
    }
);

export const createUnit = createAsyncThunk(
    'productUnit/createUnit',
    async (data: ProductUnitFormData, { rejectWithValue }) => {
        try {
            const response = await productUnitApi.createUnit(data);
            if (response.success && response.data) {
                return { unit: response.data, message: response.message };
            }
            return rejectWithValue(response.message || 'Gagal menambah satuan');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Terjadi kesalahan');
        }
    }
);

export const updateUnit = createAsyncThunk(
    'productUnit/updateUnit',
    async ({ id, data }: { id: string; data: ProductUnitFormData }, { rejectWithValue }) => {
        try {
            const response = await productUnitApi.updateUnit(id, data);
            if (response.success && response.data) {
                return { unit: response.data, message: response.message };
            }
            return rejectWithValue(response.message || 'Gagal memperbarui satuan');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Terjadi kesalahan');
        }
    }
);

export const deleteUnit = createAsyncThunk(
    'productUnit/deleteUnit',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await productUnitApi.deleteUnit(id);
            if (response.success) {
                return { id, message: response.message };
            }
            return rejectWithValue(response.message || 'Gagal menghapus satuan');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Terjadi kesalahan');
        }
    }
);

const productUnitSlice = createSlice({
    name: 'productUnit',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccessMessage: (state) => {
            state.successMessage = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Units
            .addCase(fetchUnits.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUnits.fulfilled, (state, action) => {
                state.isLoading = false;
                state.units = action.payload;
            })
            .addCase(fetchUnits.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            
            // Create Unit
            .addCase(createUnit.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createUnit.fulfilled, (state, action) => {
                state.isLoading = false;
                state.units.push(action.payload.unit);
                state.successMessage = action.payload.message || 'Berhasil disimpan';
            })
            .addCase(createUnit.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            
            // Update Unit
            .addCase(updateUnit.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateUnit.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.units.findIndex(u => u.id_product_satuan === action.payload.unit.id_product_satuan);
                if (index !== -1) {
                    state.units[index] = action.payload.unit;
                }
                state.successMessage = action.payload.message || 'Berhasil diperbarui';
            })
            .addCase(updateUnit.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            
            // Delete Unit
            .addCase(deleteUnit.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteUnit.fulfilled, (state, action) => {
                state.isLoading = false;
                state.units = state.units.filter(u => u.id_product_satuan !== action.payload.id);
                state.successMessage = action.payload.message || 'Berhasil dihapus';
            })
            .addCase(deleteUnit.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    }
});

export const { clearError, clearSuccessMessage } = productUnitSlice.actions;
export default productUnitSlice.reducer;
