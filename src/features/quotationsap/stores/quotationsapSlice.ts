import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
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
    async (search: string | undefined, { rejectWithValue }) => {
        try {
            return await quotationsapApi.fetchList(search);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchQuotationAPById = createAsyncThunk(
    'quotationsap/fetchById',
    async (id: string, { rejectWithValue }) => {
        try {
            return await quotationsapApi.fetchDetail(id);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const createQuotationAP = createAsyncThunk(
    'quotationsap/create',
    async (data: FormData, { rejectWithValue }) => {
        try {
            return await quotationsapApi.create(data);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateQuotationAP = createAsyncThunk(
    'quotationsap/update',
    async ({ id, data }: { id: string, data: FormData }, { rejectWithValue }) => {
        try {
            return await quotationsapApi.update(id, data);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const confirmQuotationAP = createAsyncThunk(
    'quotationsap/confirm',
    async (id: string, { rejectWithValue }) => {
        try {
            return await quotationsapApi.confirm(id);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const cancelQuotationAP = createAsyncThunk(
    'quotationsap/cancel',
    async (id: string, { rejectWithValue }) => {
        try {
            return await quotationsapApi.cancel(id);
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

        // Create
        builder.addCase(createQuotationAP.pending, (state) => {
            state.isSaving = true;
            state.error = null;
        });
        builder.addCase(createQuotationAP.fulfilled, (state) => {
            state.isSaving = false;
        });
        builder.addCase(createQuotationAP.rejected, (state, action) => {
            state.isSaving = false;
            state.error = action.payload as string;
        });

        // Update
        builder.addCase(updateQuotationAP.pending, (state) => {
            state.isSaving = true;
            state.error = null;
        });
        builder.addCase(updateQuotationAP.fulfilled, (state) => {
            state.isSaving = false;
        });
        builder.addCase(updateQuotationAP.rejected, (state, action) => {
            state.isSaving = false;
            state.error = action.payload as string;
        });
    }
});

export const { clearSelectedItem, clearError } = quotationsapSlice.actions;
export default quotationsapSlice.reducer;
