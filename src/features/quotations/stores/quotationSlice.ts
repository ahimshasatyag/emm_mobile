import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Quotation } from '../types/quotation.types';
import * as quotationApi from '../api/quotationApi';

interface QuotationState {
    quotations: Quotation[];
    currentQuotation: Quotation | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: QuotationState = {
    quotations: [],
    currentQuotation: null,
    isLoading: false,
    error: null,
};

export const fetchQuotations = createAsyncThunk(
    'quotations/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await quotationApi.getQuotations();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Gagal memuat quotations');
        }
    }
);

export const fetchQuotationById = createAsyncThunk(
    'quotations/fetchById',
    async (id: string, { rejectWithValue }) => {
        try {
            return await quotationApi.getQuotationById(id);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Gagal memuat detail quotation');
        }
    }
);

export const createQuotation = createAsyncThunk(
    'quotations/create',
    async (data: Quotation, { rejectWithValue }) => {
        try {
            return await quotationApi.createQuotation(data);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Gagal membuat quotation');
        }
    }
);

export const updateQuotation = createAsyncThunk(
    'quotations/update',
    async ({ id, data }: { id: string, data: Quotation }, { rejectWithValue }) => {
        try {
            return await quotationApi.updateQuotation(id, data);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Gagal memperbarui quotation');
        }
    }
);

export const deleteQuotation = createAsyncThunk(
    'quotations/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            await quotationApi.deleteQuotation(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Gagal menghapus quotation');
        }
    }
);

const quotationSlice = createSlice({
    name: 'quotations',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearCurrentQuotation: (state) => {
            state.currentQuotation = null;
        }
    },
    extraReducers: (builder) => {
        // Fetch All
        builder
            .addCase(fetchQuotations.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchQuotations.fulfilled, (state, action) => {
                state.isLoading = false;
                state.quotations = action.payload;
            })
            .addCase(fetchQuotations.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Fetch By Id
        builder
            .addCase(fetchQuotationById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchQuotationById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentQuotation = action.payload;
            })
            .addCase(fetchQuotationById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Create
        builder
            .addCase(createQuotation.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createQuotation.fulfilled, (state, action) => {
                state.isLoading = false;
                state.quotations = [action.payload, ...state.quotations];
            })
            .addCase(createQuotation.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Update
        builder
            .addCase(updateQuotation.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateQuotation.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.quotations.findIndex(q => q.id_quotation === action.payload.id_quotation);
                if (index !== -1) {
                    state.quotations[index] = action.payload;
                }
                if (state.currentQuotation?.id_quotation === action.payload.id_quotation) {
                    state.currentQuotation = action.payload;
                }
            })
            .addCase(updateQuotation.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Delete
        builder
            .addCase(deleteQuotation.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteQuotation.fulfilled, (state, action) => {
                state.isLoading = false;
                state.quotations = state.quotations.filter(q => q.id_quotation !== action.payload);
            })
            .addCase(deleteQuotation.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    }
});

export const { clearError, clearCurrentQuotation } = quotationSlice.actions;
export default quotationSlice.reducer;
