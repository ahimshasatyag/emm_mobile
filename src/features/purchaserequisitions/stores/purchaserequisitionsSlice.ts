import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PurchaseRequisition } from '../types/purchaserequisitions';
import { purchaseRequisitionsApi } from '../api';

interface PurchaseRequisitionsState {
    items: PurchaseRequisition[];
    currentDetail: PurchaseRequisition | null;
    isLoadingList: boolean;
    isLoadingDetail: boolean;
    isSaving: boolean;
    error: string | null;
}

const initialState: PurchaseRequisitionsState = {
    items: [],
    currentDetail: null,
    isLoadingList: false,
    isLoadingDetail: false,
    isSaving: false,
    error: null,
};

export const fetchPRList = createAsyncThunk(
    'purchaserequisitions/fetchList',
    async (_, { rejectWithValue }) => {
        try {
            return await purchaseRequisitionsApi.fetchList();
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch PR list');
        }
    }
);

export const fetchPRDetail = createAsyncThunk(
    'purchaserequisitions/fetchDetail',
    async (id_pr: string, { rejectWithValue }) => {
        try {
            return await purchaseRequisitionsApi.fetchDetail(id_pr);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch PR detail');
        }
    }
);

export const createPR = createAsyncThunk(
    'purchaserequisitions/create',
    async (data: Partial<PurchaseRequisition>, { rejectWithValue }) => {
        try {
            return await purchaseRequisitionsApi.create(data);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to create PR');
        }
    }
);

export const updatePR = createAsyncThunk(
    'purchaserequisitions/update',
    async ({ id_pr, data }: { id_pr: string; data: Partial<PurchaseRequisition> }, { rejectWithValue }) => {
        try {
            return await purchaseRequisitionsApi.update(id_pr, data);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to update PR');
        }
    }
);

export const ajukanPR = createAsyncThunk(
    'purchaserequisitions/ajukan',
    async (id_pr: string, { rejectWithValue }) => {
        try {
            await purchaseRequisitionsApi.ajukan(id_pr);
            return id_pr;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to ajukan PR');
        }
    }
);

const purchaserequisitionsSlice = createSlice({
    name: 'purchaserequisitions',
    initialState,
    reducers: {
        clearCurrentDetail: (state) => {
            state.currentDetail = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // Fetch List
        builder.addCase(fetchPRList.pending, (state) => {
            state.isLoadingList = true;
            state.error = null;
        });
        builder.addCase(fetchPRList.fulfilled, (state, action) => {
            state.isLoadingList = false;
            state.items = action.payload;
        });
        builder.addCase(fetchPRList.rejected, (state, action) => {
            state.isLoadingList = false;
            state.error = action.payload as string;
        });

        // Fetch Detail
        builder.addCase(fetchPRDetail.pending, (state) => {
            state.isLoadingDetail = true;
            state.error = null;
        });
        builder.addCase(fetchPRDetail.fulfilled, (state, action) => {
            state.isLoadingDetail = false;
            state.currentDetail = action.payload;
        });
        builder.addCase(fetchPRDetail.rejected, (state, action) => {
            state.isLoadingDetail = false;
            state.error = action.payload as string;
        });

        // Create
        builder.addCase(createPR.pending, (state) => {
            state.isSaving = true;
            state.error = null;
        });
        builder.addCase(createPR.fulfilled, (state, action) => {
            state.isSaving = false;
            state.items.unshift(action.payload);
        });
        builder.addCase(createPR.rejected, (state, action) => {
            state.isSaving = false;
            state.error = action.payload as string;
        });

        // Update
        builder.addCase(updatePR.pending, (state) => {
            state.isSaving = true;
            state.error = null;
        });
        builder.addCase(updatePR.fulfilled, (state, action) => {
            state.isSaving = false;
            const index = state.items.findIndex(item => item.id_pr === action.payload.id_pr);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
            if (state.currentDetail?.id_pr === action.payload.id_pr) {
                state.currentDetail = action.payload;
            }
        });
        builder.addCase(updatePR.rejected, (state, action) => {
            state.isSaving = false;
            state.error = action.payload as string;
        });

        // Ajukan
        builder.addCase(ajukanPR.pending, (state) => {
            state.isSaving = true;
            state.error = null;
        });
        builder.addCase(ajukanPR.fulfilled, (state, action) => {
            state.isSaving = false;
            const index = state.items.findIndex(item => item.id_pr === action.payload);
            if (index !== -1) {
                state.items[index].status_pr = 'PR';
            }
            if (state.currentDetail?.id_pr === action.payload) {
                state.currentDetail.status_pr = 'PR';
            }
        });
        builder.addCase(ajukanPR.rejected, (state, action) => {
            state.isSaving = false;
            state.error = action.payload as string;
        });
    },
});

export const { clearCurrentDetail, clearError } = purchaserequisitionsSlice.actions;
export default purchaserequisitionsSlice.reducer;
