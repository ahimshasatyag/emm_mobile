import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ListPaymentFilter, ListPaymentItem, ListPaymentSummaryItem } from '../types/listpayment.types';
import { getListPayment } from '../api/listpaymentApi';

interface ListPaymentState {
    items: ListPaymentItem[];
    summary: ListPaymentSummaryItem[];
    filters: ListPaymentFilter;
    isLoading: boolean;
    error: string | null;
}

const initialState: ListPaymentState = {
    items: [],
    summary: [],
    filters: {
        periode: new Date().toISOString().slice(0, 7), // "YYYY-MM"
        ck_periode: false,
        id_customers: '',
        id_product: ''
    },
    isLoading: false,
    error: null,
};

export const fetchListPayment = createAsyncThunk(
    'listpayment/fetchList',
    async (filters: ListPaymentFilter) => {
        const response = await getListPayment(filters);
        return response;
    }
);

const listpaymentSlice = createSlice({
    name: 'listpayment',
    initialState,
    reducers: {
        setFilters(state, action: PayloadAction<Partial<ListPaymentFilter>>) {
            state.filters = { ...state.filters, ...action.payload };
        }
    },
    extraReducers: (builder) => {
        builder
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
            });
    }
});

export const { setFilters } = listpaymentSlice.actions;
export default listpaymentSlice.reducer;
