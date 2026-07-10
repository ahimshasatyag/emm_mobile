import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { IncshipmentState, IncshipmentHeader } from '../types/incshipment.types';
import { incshipmentAPI } from '../api/incshipmentAPI';

const initialState: IncshipmentState = {
    items: [],
    selectedItem: null,
    isLoadingList: false,
    isLoadingDetail: false,
    isSaving: false,
    error: null,
};

export const fetchIncshipments = createAsyncThunk(
    'incshipment/fetchList',
    async (_, { rejectWithValue }) => {
        try {
            return await incshipmentAPI.fetchList();
        } catch (error: any) {
            return rejectWithValue(error.message || 'Gagal memuat data');
        }
    }
);

export const fetchIncshipmentDetail = createAsyncThunk(
    'incshipment/fetchDetail',
    async (id: string, { rejectWithValue }) => {
        try {
            return await incshipmentAPI.fetchDetail(id);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Gagal memuat detail data');
        }
    }
);

export const assignSerialNumber = createAsyncThunk(
    'incshipment/assignSerialNumber',
    async (id: string, { rejectWithValue }) => {
        try {
            return await incshipmentAPI.assignSerialNumber(id);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Gagal assign SN');
        }
    }
);

export const printBarcode = createAsyncThunk(
    'incshipment/printBarcode',
    async (id: string, { rejectWithValue }) => {
        try {
            return await incshipmentAPI.printBarcode(id);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Gagal print barcode');
        }
    }
);

export const receiveGoods = createAsyncThunk(
    'incshipment/receiveGoods',
    async ({ id, selectedItemIds }: { id: string; selectedItemIds: string[] }, { rejectWithValue }) => {
        try {
            return await incshipmentAPI.receiveGoods(id, selectedItemIds);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Gagal receive goods');
        }
    }
);

const incshipmentSlice = createSlice({
    name: 'incshipment',
    initialState,
    reducers: {
        clearSelectedIncshipment: (state) => {
            state.selectedItem = null;
        },
        clearIncshipmentError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // List
        builder
            .addCase(fetchIncshipments.pending, (state) => {
                state.isLoadingList = true;
                state.error = null;
            })
            .addCase(fetchIncshipments.fulfilled, (state, action: PayloadAction<IncshipmentHeader[]>) => {
                state.isLoadingList = false;
                state.items = action.payload;
            })
            .addCase(fetchIncshipments.rejected, (state, action) => {
                state.isLoadingList = false;
                state.error = action.payload as string;
            });

        // Detail
        builder
            .addCase(fetchIncshipmentDetail.pending, (state) => {
                state.isLoadingDetail = true;
                state.error = null;
            })
            .addCase(fetchIncshipmentDetail.fulfilled, (state, action: PayloadAction<IncshipmentHeader>) => {
                state.isLoadingDetail = false;
                state.selectedItem = action.payload;
            })
            .addCase(fetchIncshipmentDetail.rejected, (state, action) => {
                state.isLoadingDetail = false;
                state.error = action.payload as string;
            });

        // Actions
        builder
            .addCase(assignSerialNumber.pending, (state) => {
                state.isSaving = true;
                state.error = null;
            })
            .addCase(assignSerialNumber.fulfilled, (state, action: PayloadAction<IncshipmentHeader>) => {
                state.isSaving = false;
                state.selectedItem = action.payload; // Update view
            })
            .addCase(assignSerialNumber.rejected, (state, action) => {
                state.isSaving = false;
                state.error = action.payload as string;
            })
            .addCase(printBarcode.pending, (state) => {
                state.isSaving = true;
                state.error = null;
            })
            .addCase(printBarcode.fulfilled, (state, action: PayloadAction<IncshipmentHeader>) => {
                state.isSaving = false;
                state.selectedItem = action.payload;
            })
            .addCase(printBarcode.rejected, (state, action) => {
                state.isSaving = false;
                state.error = action.payload as string;
            })
            .addCase(receiveGoods.pending, (state) => {
                state.isSaving = true;
                state.error = null;
            })
            .addCase(receiveGoods.fulfilled, (state, action: PayloadAction<IncshipmentHeader>) => {
                state.isSaving = false;
                state.selectedItem = action.payload;
            })
            .addCase(receiveGoods.rejected, (state, action) => {
                state.isSaving = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearSelectedIncshipment, clearIncshipmentError } = incshipmentSlice.actions;
export default incshipmentSlice.reducer;
