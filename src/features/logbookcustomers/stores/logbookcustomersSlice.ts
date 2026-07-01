import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { LogbookCustomersState, LogbookCustomer } from '../types/logbookcustomers.types';
import { logbookCustomersApi } from '../api/logbookCustomersApi';
import { dummyCustomersData } from '../data/dummyCustomers';

const initialState: LogbookCustomersState = {
    list: [],
    current: null,
    isLoading: false,
    error: null,
};

export const fetchLogbookCustomers = createAsyncThunk(
    'logbookcustomers/fetchAll',
    async () => {
        // In real implementation: return await logbookCustomersApi.getAll();
        return new Promise<LogbookCustomer[]>((resolve) => {
            setTimeout(() => {
                resolve(dummyCustomersData);
            }, 800);
        });
    }
);

export const fetchLogbookCustomerDetail = createAsyncThunk(
    'logbookcustomers/fetchDetail',
    async (id: string) => {
        // In real implementation: return await logbookCustomersApi.getById(id);
        return new Promise<LogbookCustomer>((resolve, reject) => {
            setTimeout(() => {
                const data = dummyCustomersData.find(item => item.id_log_book === id);
                if (data) {
                    resolve(data);
                } else {
                    reject(new Error('Data not found'));
                }
            }, 800);
        });
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
            .addCase(fetchLogbookCustomerDetail.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchLogbookCustomerDetail.fulfilled, (state, action) => {
                state.isLoading = false;
                state.current = action.payload;
            })
            .addCase(fetchLogbookCustomerDetail.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch detail';
            });
    }
});

export const { clearCurrent } = logbookcustomersSlice.actions;
export default logbookcustomersSlice.reducer;
