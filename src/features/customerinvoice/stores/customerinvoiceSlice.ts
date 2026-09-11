import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CustomerInvoice } from '../types/customerinvoice';
import { customerinvoiceApi } from '../api/customerinvoiceApi';

interface CustomerInvoiceState {
    list: CustomerInvoice[];
    detail: CustomerInvoice | null;
    loading: boolean;
    loadingDetail: boolean;
    isSubmitting: boolean;
    error: string | null;
}

const initialState: CustomerInvoiceState = {
    list: [],
    detail: null,
    loading: false,
    loadingDetail: false,
    isSubmitting: false,
    error: null,
};

export const fetchCustomerInvoices = createAsyncThunk(
    'customerinvoice/fetchList',
    async (params: Parameters<typeof customerinvoiceApi.getList>[0] = {}, { rejectWithValue }) => {
        try {
            return await customerinvoiceApi.getList(params);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Gagal memuat data invoice');
        }
    }
);

export const fetchCustomerInvoiceDetail = createAsyncThunk(
    'customerinvoice/fetchDetail',
    async (id: string, { rejectWithValue }) => {
        try {
            return await customerinvoiceApi.getDetail(id);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Gagal memuat detail invoice');
        }
    }
);

export const submitInvoiceAction = createAsyncThunk(
    'customerinvoice/submitAction',
    async ({ action, payload }: { action: string; payload: any }, { rejectWithValue }) => {
        try {
            switch (action) {
                case 'STORE_DETAIL':
                    return await customerinvoiceApi.storeInvoiceDetail(payload);
                case 'GANTI_STATUS':
                    return await customerinvoiceApi.gantiStatus(payload);
                case 'BACK_STATUS':
                    return await customerinvoiceApi.backStatus(payload);
                case 'POSTING':
                    return await customerinvoiceApi.posting(payload);
                case 'UNPOSTING':
                    return await customerinvoiceApi.unposting(payload);
                case 'SIMPAN_AR':
                    return await customerinvoiceApi.simpanArPelunasan(payload);
                case 'UPDATE_CODE_PI':
                    return await customerinvoiceApi.updateCodePi(payload.id_invoice);
                default:
                    return rejectWithValue('Aksi tidak dikenal');
            }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Aksi gagal');
        }
    }
);

const customerinvoiceSlice = createSlice({
    name: 'customerinvoice',
    initialState,
    reducers: {
        clearDetail: (state) => {
            state.detail = null;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetchList
            .addCase(fetchCustomerInvoices.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCustomerInvoices.fulfilled, (state, action) => {
                state.loading = false;
                state.list = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchCustomerInvoices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // fetchDetail
            .addCase(fetchCustomerInvoiceDetail.pending, (state) => {
                state.loadingDetail = true;
                state.error = null;
            })
            .addCase(fetchCustomerInvoiceDetail.fulfilled, (state, action) => {
                state.loadingDetail = false;
                state.detail = action.payload ?? null;
            })
            .addCase(fetchCustomerInvoiceDetail.rejected, (state, action) => {
                state.loadingDetail = false;
                state.error = action.payload as string;
            })
            // submitAction
            .addCase(submitInvoiceAction.pending, (state) => {
                state.isSubmitting = true;
                state.error = null;
            })
            .addCase(submitInvoiceAction.fulfilled, (state) => {
                state.isSubmitting = false;
            })
            .addCase(submitInvoiceAction.rejected, (state, action) => {
                state.isSubmitting = false;
                state.error = action.payload as string;
            });
    }
});

export const { clearDetail, clearError } = customerinvoiceSlice.actions;
export default customerinvoiceSlice.reducer;
