import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ListPaymentFilter, ListPaymentItem, ListPaymentSummaryItem, ListPaymentDetail } from '../types/listpayment.types';
import { getListPayment, getPaymentDetail } from '../api/listpaymentApi';

interface ListPaymentState {
    items: ListPaymentItem[];
    summary: ListPaymentSummaryItem[];
    currentDetail: ListPaymentDetail | null;
    filters: ListPaymentFilter;
    isLoading: boolean;
    isLoadingDetail: boolean;
    error: string | null;
}

const initialState: ListPaymentState = {
    items: [],
    summary: [],
    currentDetail: null,
    filters: {
        periode: new Date().toISOString().slice(0, 7), // "YYYY-MM"
        ck_periode: false,
        id_customers: '',
        id_product: ''
    },
    isLoading: false,
    isLoadingDetail: false,
    error: null,
};

export const fetchListPayment = createAsyncThunk(
    'listpayment/fetchList',
    async (filters: ListPaymentFilter) => {
        const response = await getListPayment(filters);
        return response;
    }
);

export const fetchPaymentDetail = createAsyncThunk(
    'listpayment/fetchDetail',
    async (id: string) => {
        const data = await getPaymentDetail(id);
        return data;
    }
);

const listpaymentSlice = createSlice({
    name: 'listpayment',
    initialState,
    reducers: {
        setFilters(state, action: PayloadAction<Partial<ListPaymentFilter>>) {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearDetail(state) {
            state.currentDetail = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // List
            .addCase(fetchListPayment.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchListPayment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload.data || [];
                state.summary = action.payload.data_lap || [];
            })
            .addCase(fetchListPayment.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to load list payment';
            })
            // Detail
            .addCase(fetchPaymentDetail.pending, (state) => {
                state.isLoadingDetail = true;
                state.error = null;
            })
            .addCase(fetchPaymentDetail.fulfilled, (state, action) => {
                state.isLoadingDetail = false;
                state.currentDetail = action.payload;
            })
            .addCase(fetchPaymentDetail.rejected, (state, action) => {
                state.isLoadingDetail = false;
                state.error = action.error.message || 'Failed to load payment detail';
            });
    }
});

export const { setFilters, clearDetail } = listpaymentSlice.actions;
export default listpaymentSlice.reducer;
