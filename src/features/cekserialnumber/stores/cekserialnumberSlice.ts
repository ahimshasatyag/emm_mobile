import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { cekSerialNumberApi } from '../api/cekSerialNumberApi';
import { CekSerialNumberData, HistoryService } from '../types/cekserialnumber.types';

export const searchSerialNumber = createAsyncThunk(
    'cekserialnumber/search',
    async (barcode: string, { rejectWithValue }) => {
        try {
            const response = await cekSerialNumberApi.searchSerialNumber(barcode);
            if (!response.status) {
                return rejectWithValue("Serial Number tidak ditemukan.");
            }
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || "Terjadi kesalahan saat mencari.");
        }
    }
);

interface CekSerialNumberState {
    barcode: string;
    productInfo: CekSerialNumberData | null;
    historyServices: HistoryService[];
    isLoading: boolean;
    error: string | null;
    hasSearched: boolean;
}

const initialState: CekSerialNumberState = {
    barcode: '',
    productInfo: null,
    historyServices: [],
    isLoading: false,
    error: null,
    hasSearched: false
};

const cekSerialNumberSlice = createSlice({
    name: 'cekserialnumber',
    initialState,
    reducers: {
        setBarcode: (state, action: PayloadAction<string>) => {
            state.barcode = action.payload;
            state.hasSearched = false;
        },
        clearSearch: (state) => {
            state.barcode = '';
            state.productInfo = null;
            state.historyServices = [];
            state.error = null;
            state.hasSearched = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchSerialNumber.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.hasSearched = true;
            })
            .addCase(searchSerialNumber.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload.data && action.payload.data.length > 0) {
                    state.productInfo = action.payload.data[0];
                } else {
                    state.productInfo = null;
                }
                state.historyServices = action.payload.history || [];
            })
            .addCase(searchSerialNumber.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.productInfo = null;
                state.historyServices = [];
            });
    }
});

export const { setBarcode, clearSearch } = cekSerialNumberSlice.actions;
export default cekSerialNumberSlice.reducer;
