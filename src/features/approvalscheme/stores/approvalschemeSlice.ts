import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ApprovalSchemeData } from '../types/approvalscheme.types';
import { fetchApprovalSchemesApi, deleteApprovalSchemeApi } from '../api/approvalscheme.api';

interface ApprovalSchemeState {
    data: ApprovalSchemeData[];
    loading: boolean;
    error: string | null;
}

const initialState: ApprovalSchemeState = {
    data: [],
    loading: false,
    error: null,
};

export const fetchApprovalSchemes = createAsyncThunk('approvalscheme/fetch', async () => {
    return await fetchApprovalSchemesApi();
});

export const deleteApprovalScheme = createAsyncThunk('approvalscheme/delete', async (id: string) => {
    await deleteApprovalSchemeApi(id);
    return id;
});

const approvalSchemeSlice = createSlice({
    name: 'approvalscheme',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchApprovalSchemes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchApprovalSchemes.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchApprovalSchemes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Gagal memuat data skema approval';
            })
            .addCase(deleteApprovalScheme.fulfilled, (state, action) => {
                state.data = state.data.filter(item => item.id !== action.payload);
            });
    },
});

export const approvalSchemeReducer = approvalSchemeSlice.reducer;
