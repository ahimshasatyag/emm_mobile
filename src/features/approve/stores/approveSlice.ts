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

export const fetchApprovals = createAsyncThunk(
    'approve/fetchApprovals',
    async (search?: string) => {
        return await approveApi.fetchApproveData(search);
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
            // Fetch All Approvals
            .addCase(fetchApprovals.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchApprovals.fulfilled, (state, action) => {
                state.loading = false;
                state.quotations = action.payload.data_quotations || [];
                state.accounting = action.payload.data_accounting || [];
                state.history = action.payload.data_history || [];
            })
            .addCase(fetchApprovals.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch approvals';
            });
    }
});

export const { clearApproveError } = approveSlice.actions;
export default approveSlice.reducer;
