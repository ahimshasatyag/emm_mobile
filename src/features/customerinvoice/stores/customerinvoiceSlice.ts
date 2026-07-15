import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CustomerInvoice } from '../types/customerinvoice';
import { customerinvoiceApi } from '../api/customerinvoiceApi';

interface CustomerInvoiceState {
    list: CustomerInvoice[];
    detail: CustomerInvoice | null;
    loading: boolean;
    error: string | null;
}

const initialState: CustomerInvoiceState = {
    list: [],
    detail: null,
    loading: false,
    error: null,
};

export const fetchCustomerInvoices = createAsyncThunk(
    'customerinvoice/fetchList',
    async (_, { rejectWithValue }) => {
        try {
            const data = await customerinvoiceApi.getList();
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchCustomerInvoiceDetail = createAsyncThunk(
    'customerinvoice/fetchDetail',
    async (id: string, { rejectWithValue }) => {
        try {
            const data = await customerinvoiceApi.getDetail(id);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const customerinvoiceSlice = createSlice({
    name: 'customerinvoice',
    initialState,
    reducers: {
        clearDetail: (state) => {
            state.detail = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCustomerInvoices.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCustomerInvoices.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchCustomerInvoices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchCustomerInvoiceDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCustomerInvoiceDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.detail = action.payload || null;
            })
            .addCase(fetchCustomerInvoiceDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const { clearDetail } = customerinvoiceSlice.actions;
export default customerinvoiceSlice.reducer;
