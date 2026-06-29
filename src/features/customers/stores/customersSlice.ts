import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Customer } from '../types/customers.types';
import { customersApi } from '../api/customers.api';

interface CustomersState {
    data: Customer[];
    filteredData: Customer[];
    isLoading: boolean;
    error: string | null;
    searchQuery: string;
}

const initialState: CustomersState = {
    data: [],
    filteredData: [],
    isLoading: false,
    error: null,
    searchQuery: '',
};

export const fetchCustomers = createAsyncThunk(
    'customers/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await customersApi.fetchCustomers();
            if (response.success) {
                return response.data;
            }
            return rejectWithValue('Gagal mengambil data pelanggan');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Gagal mengambil data pelanggan');
        }
    }
);

export const deleteCustomer = createAsyncThunk(
    'customers/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await customersApi.deleteCustomer(id);
            if (response.success) {
                return id;
            }
            return rejectWithValue('Gagal menghapus data pelanggan');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Gagal menghapus data pelanggan');
        }
    }
);

const customersSlice = createSlice({
    name: 'customers',
    initialState,
    reducers: {
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
            const query = action.payload.toLowerCase();
            if (!query) {
                state.filteredData = state.data;
            } else {
                state.filteredData = state.data.filter(
                    (item) => 
                        item.nm_customers.toLowerCase().includes(query) || 
                        item.code_customers.toLowerCase().includes(query) ||
                        item.customers_phone?.toLowerCase().includes(query) ||
                        item.customers_address?.toLowerCase().includes(query)
                );
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch All
            .addCase(fetchCustomers.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCustomers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
                
                if (state.searchQuery) {
                    const query = state.searchQuery.toLowerCase();
                    state.filteredData = action.payload.filter(
                        (item) => 
                            item.nm_customers.toLowerCase().includes(query) || 
                            item.code_customers.toLowerCase().includes(query) ||
                            item.customers_phone?.toLowerCase().includes(query) ||
                            item.customers_address?.toLowerCase().includes(query)
                    );
                } else {
                    state.filteredData = action.payload;
                }
            })
            .addCase(fetchCustomers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Delete
            .addCase(deleteCustomer.fulfilled, (state, action) => {
                state.data = state.data.filter(c => c.id_customers !== action.payload);
                state.filteredData = state.filteredData.filter(c => c.id_customers !== action.payload);
            });
    },
});

export const { setSearchQuery } = customersSlice.actions;
export default customersSlice.reducer;
