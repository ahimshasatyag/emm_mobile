import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Csr, CsrPayload } from '../types/csr.types';
import { csrApi } from '../api/csr.api';

interface CsrState {
    requests: Csr[];
    currentRequest: Csr | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: CsrState = {
    requests: [],
    currentRequest: null,
    isLoading: false,
    error: null,
};

export const fetchCsrs = createAsyncThunk(
    'csr/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await csrApi.getAll();
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch CSRs');
        }
    }
);

export const fetchCsrById = createAsyncThunk(
    'csr/fetchById',
    async (id: string, { rejectWithValue }) => {
        try {
            return await csrApi.getById(id);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch CSR');
        }
    }
);

export const createCsr = createAsyncThunk(
    'csr/create',
    async (payload: CsrPayload, { rejectWithValue }) => {
        try {
            return await csrApi.create(payload);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to create CSR');
        }
    }
);

export const updateCsr = createAsyncThunk(
    'csr/update',
    async ({ id, payload }: { id: string; payload: Partial<CsrPayload> }, { rejectWithValue }) => {
        try {
            return await csrApi.update(id, payload);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to update CSR');
        }
    }
);

export const confirmCsr = createAsyncThunk(
    'csr/confirm',
    async (id: string, { rejectWithValue }) => {
        try {
            return await csrApi.confirm(id);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to confirm CSR');
        }
    }
);

export const cancelCsr = createAsyncThunk(
    'csr/cancel',
    async ({ id, memo }: { id: string; memo: string }, { rejectWithValue }) => {
        try {
            return await csrApi.cancel(id, memo);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to cancel CSR');
        }
    }
);

const csrSlice = createSlice({
    name: 'csr',
    initialState,
    reducers: {
        clearCurrentRequest: (state) => {
            state.currentRequest = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetchAll
            .addCase(fetchCsrs.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCsrs.fulfilled, (state, action) => {
                state.isLoading = false;
                state.requests = action.payload;
            })
            .addCase(fetchCsrs.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // fetchById
            .addCase(fetchCsrById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCsrById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentRequest = action.payload;
            })
            .addCase(fetchCsrById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // create
            .addCase(createCsr.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createCsr.fulfilled, (state, action) => {
                state.isLoading = false;
                state.requests.unshift(action.payload);
            })
            .addCase(createCsr.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // update
            .addCase(updateCsr.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateCsr.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.requests.findIndex(r => r.id === action.payload.id);
                if (index !== -1) {
                    state.requests[index] = action.payload;
                }
                state.currentRequest = action.payload;
            })
            .addCase(updateCsr.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // confirm
            .addCase(confirmCsr.fulfilled, (state, action) => {
                const index = state.requests.findIndex(r => r.id === action.payload.id);
                if (index !== -1) {
                    state.requests[index] = action.payload;
                }
                if (state.currentRequest?.id === action.payload.id) {
                    state.currentRequest = action.payload;
                }
            })
            // cancel
            .addCase(cancelCsr.fulfilled, (state, action) => {
                const index = state.requests.findIndex(r => r.id === action.payload.id);
                if (index !== -1) {
                    state.requests[index] = action.payload;
                }
                if (state.currentRequest?.id === action.payload.id) {
                    state.currentRequest = action.payload;
                }
            });
    },
});

export const { clearCurrentRequest } = csrSlice.actions;
export default csrSlice.reducer;
