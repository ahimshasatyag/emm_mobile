import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { QuotationAP } from '../types/quotationsap.types';
import { quotationsapApi } from '../api/quotationsapApi';

interface QuotationsAPState {
    items: QuotationAP[];
    selectedItem: QuotationAP | null;
    isLoadingList: boolean;
    isLoadingDetail: boolean;
    isSaving: boolean;
    error: string | null;
}

const initialState: QuotationsAPState = {
    items: [],
    selectedItem: null,
    isLoadingList: false,
    isLoadingDetail: false,
    isSaving: false,
    error: null,
};

export const fetchQuotationsAP = createAsyncThunk(
    'quotationsap/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await quotationsapApi.getQuotations();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchQuotationAPById = createAsyncThunk(
    'quotationsap/fetchById',
    async (id: string, { rejectWithValue }) => {
        try {
            return await quotationsapApi.getQuotationById(id);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const saveQuotationAP = createAsyncThunk(
    'quotationsap/save',
    async (data: QuotationAP, { rejectWithValue }) => {
        try {
            return await quotationsapApi.saveQuotation(data);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const quotationsapSlice = createSlice({
    name: 'quotationsap',
    initialState,
    reducers: {
        clearSelectedItem: (state) => {
            state.selectedItem = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // Fetch All
        builder.addCase(fetchQuotationsAP.pending, (state) => {
            state.isLoadingList = true;
            state.error = null;
        });
        builder.addCase(fetchQuotationsAP.fulfilled, (state, action) => {
            state.isLoadingList = false;
            state.items = action.payload;
        });
        builder.addCase(fetchQuotationsAP.rejected, (state, action) => {
            state.isLoadingList = false;
            state.error = action.payload as string;
        });

        // Fetch By Id
        builder.addCase(fetchQuotationAPById.pending, (state) => {
            state.isLoadingDetail = true;
            state.error = null;
        });
        builder.addCase(fetchQuotationAPById.fulfilled, (state, action) => {
            state.isLoadingDetail = false;
            state.selectedItem = action.payload;
        });
        builder.addCase(fetchQuotationAPById.rejected, (state, action) => {
            state.isLoadingDetail = false;
            state.error = action.payload as string;
        });

        // Save
        builder.addCase(saveQuotationAP.pending, (state) => {
            state.isSaving = true;
            state.error = null;
        });
        builder.addCase(saveQuotationAP.fulfilled, (state, action) => {
            state.isSaving = false;
            // Optionally update the list if needed, or rely on a re-fetch
            const index = state.items.findIndex(item => item.id_po === action.payload.id_po);
            if (index !== -1) {
                state.items[index] = action.payload;
            } else {
                state.items.unshift(action.payload);
            }
        });
        builder.addCase(saveQuotationAP.rejected, (state, action) => {
            state.isSaving = false;
            state.error = action.payload as string;
        });
    }
});

export const { clearSelectedItem, clearError } = quotationsapSlice.actions;
export default quotationsapSlice.reducer;
