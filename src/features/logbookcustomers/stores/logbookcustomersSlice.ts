import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { LogbookCustomersState, LogbookCustomer } from '../types/logbookcustomers.types';
import { logbookCustomersApi } from '../api/logbookCustomersApi';

const initialState: LogbookCustomersState = {
    list: [],
    current: null,
    masterDataCustomers: [],
    isLoading: false,
    error: null,
};

export const fetchLogbookCustomers = createAsyncThunk(
    'logbookcustomers/fetchAll',
    async () => {
        return await logbookCustomersApi.getAll();
    }
);

export const fetchLogbookCustomersCreateMasterData = createAsyncThunk(
    'logbookcustomers/fetchCreateMasterData',
    async () => {
        return await logbookCustomersApi.getCreateMasterData();
    }
);

export const fetchLogbookCustomerDetail = createAsyncThunk(
    'logbookcustomers/fetchDetail',
    async (id: string) => {
        return await logbookCustomersApi.getById(id);
    }
);

export const createLogbookCustomer = createAsyncThunk(
    'logbookcustomers/create',
    async (data: Partial<LogbookCustomer>) => {
        return await logbookCustomersApi.create(data);
    }
);

export const updateLogbookCustomer = createAsyncThunk(
    'logbookcustomers/update',
    async (data: Partial<LogbookCustomer> & { id_log_book: string }) => {
        const { id_log_book, ...updateData } = data;
        return await logbookCustomersApi.update(id_log_book, updateData);
    }
);

export const deleteLogbookCustomer = createAsyncThunk(
    'logbookcustomers/delete',
    async (id: string) => {
        await logbookCustomersApi.delete(id);
        return id;
    }
);

const logbookcustomersSlice = createSlice({
    name: 'logbookcustomers',
    initialState,
    reducers: {
        clearCurrent: (state) => {
            state.current = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetchAll
            .addCase(fetchLogbookCustomers.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchLogbookCustomers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(fetchLogbookCustomers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch';
            })
            // fetchCreateMasterData
            .addCase(fetchLogbookCustomersCreateMasterData.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchLogbookCustomersCreateMasterData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.masterDataCustomers = action.payload.data_customers;
            })
            .addCase(fetchLogbookCustomersCreateMasterData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch master data';
            })
            // fetchDetail
            .addCase(fetchLogbookCustomerDetail.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchLogbookCustomerDetail.fulfilled, (state, action) => {
                state.isLoading = false;
                state.current = action.payload.data;
                state.masterDataCustomers = action.payload.data_customers;
            })
            .addCase(fetchLogbookCustomerDetail.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch detail';
            })
            // delete
            .addCase(deleteLogbookCustomer.fulfilled, (state, action) => {
                state.list = state.list.filter(item => item.id_log_book !== action.payload);
            });
    }
});

export const { clearCurrent } = logbookcustomersSlice.actions;
export default logbookcustomersSlice.reducer;
