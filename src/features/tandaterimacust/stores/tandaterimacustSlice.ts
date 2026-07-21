import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TandaTerimaCustItem, CustomerData } from '../types/tandaterimacust.types';
import { tandaterimacustApi } from '../api/tandaterimacustApi';

interface TandaTerimaCustState {
    list: TandaTerimaCustItem[];
    customers: CustomerData[];
    currentItem: TandaTerimaCustItem | null;
    loading: boolean;
    error: string | null;
}

const initialState: TandaTerimaCustState = {
    list: [],
    customers: [],
    currentItem: null,
    loading: false,
    error: null,
};

export const fetchCustomers = createAsyncThunk('tandaterimacust/fetchCustomers', async () => {
    return await tandaterimacustApi.fetchCustomers();
});

export const fetchTandaTerimaCusts = createAsyncThunk('tandaterimacust/fetchList', async () => {
    return await tandaterimacustApi.fetchTandaTerimaCusts();
});

export const fetchTandaTerimaCustById = createAsyncThunk('tandaterimacust/fetchById', async (id: string) => {
    return await tandaterimacustApi.fetchTandaTerimaCustById(id);
});

export const addTandaTerimaCust = createAsyncThunk('tandaterimacust/add', async (payload: Omit<TandaTerimaCustItem, 'id_tanda_terima_cust' | 'nm_customers'>) => {
    return await tandaterimacustApi.addTandaTerimaCust(payload);
});

export const updateTandaTerimaCust = createAsyncThunk('tandaterimacust/update', async ({ id, payload }: { id: string, payload: Partial<TandaTerimaCustItem> }) => {
    return await tandaterimacustApi.updateTandaTerimaCust(id, payload);
});

export const deleteTandaTerimaCust = createAsyncThunk('tandaterimacust/delete', async (id: string) => {
    await tandaterimacustApi.deleteTandaTerimaCust(id);
    return id;
});

const tandaterimacustSlice = createSlice({
    name: 'tandaterimacust',
    initialState,
    reducers: {
        clearCurrentItem: (state) => {
            state.currentItem = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Customers
            .addCase(fetchCustomers.fulfilled, (state, action) => {
                state.customers = action.payload;
            })
            // Fetch List
            .addCase(fetchTandaTerimaCusts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTandaTerimaCusts.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchTandaTerimaCusts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch data';
            })
            // Fetch By Id
            .addCase(fetchTandaTerimaCustById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTandaTerimaCustById.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.currentItem = action.payload;
                }
            })
            .addCase(fetchTandaTerimaCustById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch detail';
            })
            // Add
            .addCase(addTandaTerimaCust.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
            // Update
            .addCase(updateTandaTerimaCust.fulfilled, (state, action) => {
                const index = state.list.findIndex(x => x.id_tanda_terima_cust === action.payload.id_tanda_terima_cust);
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
                if (state.currentItem?.id_tanda_terima_cust === action.payload.id_tanda_terima_cust) {
                    state.currentItem = action.payload;
                }
            })
            // Delete
            .addCase(deleteTandaTerimaCust.fulfilled, (state, action) => {
                state.list = state.list.filter(x => x.id_tanda_terima_cust !== action.payload);
            });
    }
});

export const { clearCurrentItem } = tandaterimacustSlice.actions;
export default tandaterimacustSlice.reducer;
