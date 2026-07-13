import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { QuotationApproval, AccountingApproval, HistoryApproval } from '../types/approve.types';
import { approveApi } from '../api/approveApi';

interface ApproveState {
    quotations: QuotationApproval[];
    accounting: AccountingApproval[];
    history: HistoryApproval[];
    loading: boolean;
    error: string | null;
}

const initialState: ApproveState = {
    quotations: [],
    accounting: [],
    history: [],
    loading: false,
    error: null,
};

export const fetchQuotations = createAsyncThunk(
    'approve/fetchQuotations',
    async (search?: string) => {
        return await approveApi.fetchQuotations(search);
    }
);

export const fetchAccounting = createAsyncThunk(
    'approve/fetchAccounting',
    async (search?: string) => {
        return await approveApi.fetchAccounting(search);
    }
);

export const fetchHistory = createAsyncThunk(
    'approve/fetchHistory',
    async (search?: string) => {
        return await approveApi.fetchHistory(search);
    }
);

export const submitApprovalAction = createAsyncThunk(
    'approve/submitApproval',
    async (data: { id_approval: string, action: string, status: string }) => {
        return await approveApi.submitApproval(data.id_approval, data.action, data.status);
    }
);

const approveSlice = createSlice({
    name: 'approve',
    initialState,
    reducers: {
        clearApproveError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Quotations
            .addCase(fetchQuotations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchQuotations.fulfilled, (state, action) => {
                state.loading = false;
                state.quotations = action.payload;
            })
            .addCase(fetchQuotations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch quotations';
            })
            // Fetch Accounting
            .addCase(fetchAccounting.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAccounting.fulfilled, (state, action) => {
                state.loading = false;
                state.accounting = action.payload;
            })
            .addCase(fetchAccounting.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch accounting';
            })
            // Fetch History
            .addCase(fetchHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.history = action.payload;
            })
            .addCase(fetchHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch history';
            });
    }
});

export const { clearApproveError } = approveSlice.actions;
export default approveSlice.reducer;
