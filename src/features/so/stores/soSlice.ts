import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SalesOrder } from '../types/so.types';
import { soApi } from '../api/soApi';

interface SOState {
    items: SalesOrder[];
    currentSO: SalesOrder | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: SOState = {
    items: [],
    currentSO: null,
    isLoading: false,
    error: null,
};

// Async Thunks
export const fetchSOList = createAsyncThunk(
    'so/fetchList',
    async (_, { rejectWithValue }) => {
        try {
            const data = await soApi.fetchSOList();
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch SO list');
        }
    }
);

export const getSOById = createAsyncThunk(
    'so/getById',
    async (id: string, { rejectWithValue }) => {
        try {
            const data = await soApi.getSOById(id);
            if (!data) throw new Error("SO Not Found");
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch SO detail');
        }
    }
);

export const createSO = createAsyncThunk(
    'so/create',
    async (soData: SalesOrder, { rejectWithValue }) => {
        try {
            const data = await soApi.createSO(soData);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to create SO');
        }
    }
);

export const updateSO = createAsyncThunk(
    'so/update',
    async ({ id, data }: { id: string; data: Partial<SalesOrder> }, { rejectWithValue }) => {
        try {
            const updated = await soApi.updateSO(id, data);
            return updated;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to update SO');
        }
    }
);

const soSlice = createSlice({
    name: 'so',
    initialState,
    reducers: {
        clearCurrentSO: (state) => {
            state.currentSO = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // Fetch List
        builder.addCase(fetchSOList.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchSOList.fulfilled, (state, action: PayloadAction<SalesOrder[]>) => {
            state.isLoading = false;
            state.items = action.payload;
        });
        builder.addCase(fetchSOList.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Get By Id
        builder.addCase(getSOById.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getSOById.fulfilled, (state, action: PayloadAction<SalesOrder>) => {
            state.isLoading = false;
            state.currentSO = action.payload;
        });
        builder.addCase(getSOById.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Create SO
        builder.addCase(createSO.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(createSO.fulfilled, (state, action: PayloadAction<SalesOrder>) => {
            state.isLoading = false;
            state.items.unshift(action.payload);
        });
        builder.addCase(createSO.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // Update SO
        builder.addCase(updateSO.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(updateSO.fulfilled, (state, action: PayloadAction<SalesOrder>) => {
            state.isLoading = false;
            const index = state.items.findIndex(s => s.id_so === action.payload.id_so);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
            if (state.currentSO?.id_so === action.payload.id_so) {
                state.currentSO = action.payload;
            }
        });
        builder.addCase(updateSO.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });
    }
});

export const { clearCurrentSO, clearError } = soSlice.actions;
export default soSlice.reducer;
