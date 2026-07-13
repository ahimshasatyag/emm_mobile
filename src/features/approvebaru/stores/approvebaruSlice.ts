import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ApprovebaruItem, ApprovebaruDetail } from '../types/approvebaru.types';
import { approvebaruApi } from '../api/approvebaru.api';

interface ApprovebaruState {
    approvals: ApprovebaruItem[];
    currentDetail: ApprovebaruDetail | null;
    loading: boolean;
    loadingDetail: boolean;
    error: string | null;
}

const initialState: ApprovebaruState = {
    approvals: [],
    currentDetail: null,
    loading: false,
    loadingDetail: false,
    error: null,
};

export const fetchPendingApprovals = createAsyncThunk(
    'approvebaru/fetchPendingApprovals',
    async (_, { rejectWithValue }) => {
        try {
            const data = await approvebaruApi.getPendingApprovals();
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch approvals');
        }
    }
);

export const fetchApprovalDetail = createAsyncThunk(
    'approvebaru/fetchApprovalDetail',
    async (id: number, { rejectWithValue }) => {
        try {
            const data = await approvebaruApi.getApprovalDetail(id);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch detail');
        }
    }
);

export const submitApproveAction = createAsyncThunk(
    'approvebaru/submitApprove',
    async (id: number, { rejectWithValue }) => {
        try {
            const data = await approvebaruApi.submitApprove(id);
            return { id, ...data };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to approve');
        }
    }
);

export const submitRejectAction = createAsyncThunk(
    'approvebaru/submitReject',
    async ({ id, reason }: { id: number, reason: string }, { rejectWithValue }) => {
        try {
            const data = await approvebaruApi.submitReject(id, reason);
            return { id, ...data };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to reject');
        }
    }
);

const approvebaruSlice = createSlice({
    name: 'approvebaru',
    initialState,
    reducers: {
        clearDetail: (state) => {
            state.currentDetail = null;
        }
    },
    extraReducers: (builder) => {
        // Fetch Approvals
        builder.addCase(fetchPendingApprovals.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchPendingApprovals.fulfilled, (state, action: PayloadAction<ApprovebaruItem[]>) => {
            state.loading = false;
            state.approvals = action.payload;
        });
        builder.addCase(fetchPendingApprovals.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Fetch Detail
        builder.addCase(fetchApprovalDetail.pending, (state) => {
            state.loadingDetail = true;
            state.error = null;
        });
        builder.addCase(fetchApprovalDetail.fulfilled, (state, action: PayloadAction<ApprovebaruDetail>) => {
            state.loadingDetail = false;
            state.currentDetail = action.payload;
        });
        builder.addCase(fetchApprovalDetail.rejected, (state, action) => {
            state.loadingDetail = false;
            state.error = action.payload as string;
        });

        // Appprove action optimism
        builder.addCase(submitApproveAction.fulfilled, (state, action) => {
            // Remove the approved item from the list
            state.approvals = state.approvals.filter(item => item.id !== action.payload.id);
        });

        // Reject action optimism
        builder.addCase(submitRejectAction.fulfilled, (state, action) => {
            // Remove the rejected item from the list
            state.approvals = state.approvals.filter(item => item.id !== action.payload.id);
        });
    },
});

export const { clearDetail } = approvebaruSlice.actions;
export default approvebaruSlice.reducer;
