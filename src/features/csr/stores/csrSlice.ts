import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Csr, CsrPayload } from '../types/csr.types';
import { csrApi } from '../api/csr.api';

interface CsrState {
    requests: Csr[];
    currentRequest: Csr | null;
    formOptions: {
        products: any[];
        customers: any[];
        karyawan: any[];
    };
    isLoading: boolean;
    error: string | null;
}

const initialState: CsrState = {
    requests: [],
    currentRequest: null,
    formOptions: {
        products: [],
        customers: [],
        karyawan: [],
    },
    isLoading: false,
    error: null,
};

export const fetchCsrs = createAsyncThunk(
    'csr/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const data = await csrApi.getAll();
            return data.map((item: any) => ({
                ...item,
                id: item.id_afs_csr?.toString() || item.id,
                status: item.csr_status || item.status,
            }));
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch CSRs');
        }
    }
);

export const fetchCsrById = createAsyncThunk(
    'csr/fetchById',
    async (id: string, { rejectWithValue }) => {
        try {
            const data = await csrApi.getById(id);
            return data ? { ...data, id: data.id_afs_csr?.toString() || data.id, status: data.csr_status || data.status } : null;
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
    async ({ id, payload }: { id: string; payload?: any }, { rejectWithValue }) => {
        try {
            return await csrApi.confirm(id, payload);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to confirm CSR');
        }
    }
);

export const cancelCsr = createAsyncThunk(
    'csr/cancel',
    async ({ id, memo, user_id, id_users_level, role }: any, { rejectWithValue }) => {
        try {
            return await csrApi.cancel(id, { memo, user_id, id_users_level, role });
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to cancel CSR');
        }
    }
);

export const fetchFormOptions = createAsyncThunk(
    'csr/fetchFormOptions',
    async (_, { rejectWithValue }) => {
        try {
            return await csrApi.getFormOptions();
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch form options');
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
                const index = state.requests.findIndex(r => r.id === action.payload.id || r.id_afs_csr === action.payload.id_afs_csr);
                if (index !== -1) {
                    state.requests[index] = action.payload;
                }
                if (state.currentRequest?.id === action.payload.id || state.currentRequest?.id_afs_csr === action.payload.id_afs_csr) {
                    state.currentRequest = action.payload;
                }
            })
            // form options
            .addCase(fetchFormOptions.fulfilled, (state, action) => {
                state.formOptions = action.payload || { products: [], customers: [], karyawan: [] };
            });
    },
});

export const { clearCurrentRequest } = csrSlice.actions;
export default csrSlice.reducer;
