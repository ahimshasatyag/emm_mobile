import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CustomerContact } from '../types/customerContacts.types';
import { customerContactsApi } from '../api/customerContacts.api';

interface CustomerContactsState {
    data: CustomerContact[];
    filteredData: CustomerContact[];
    isLoading: boolean;
    error: string | null;
    searchQuery: string;
}

const initialState: CustomerContactsState = {
    data: [],
    filteredData: [],
    isLoading: false,
    error: null,
    searchQuery: '',
};

export const fetchCustomerContacts = createAsyncThunk(
    'customerContacts/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await customerContactsApi.fetchCustomerContacts();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch customer contacts');
        }
    }
);

export const deleteCustomerContact = createAsyncThunk(
    'customerContacts/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            await customerContactsApi.deleteCustomerContact(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to delete customer contact');
        }
    }
);

const customerContactsSlice = createSlice({
    name: 'customerContacts',
    initialState,
    reducers: {
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
            const query = action.payload.toLowerCase();
            state.filteredData = state.data.filter((item) => {
                const nameMatch = item.nm_customers_contact?.toLowerCase().includes(query);
                const companyMatch = item.nm_customers?.toLowerCase().includes(query);
                const phoneMatch = item.customers_contact_phone?.toLowerCase().includes(query) || item.customers_contact_mobile?.toLowerCase().includes(query);
                return nameMatch || companyMatch || phoneMatch;
            });
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch list
            .addCase(fetchCustomerContacts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCustomerContacts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
                // Re-apply filter if exists
                if (state.searchQuery) {
                    const query = state.searchQuery.toLowerCase();
                    state.filteredData = action.payload.filter((item) => {
                        const nameMatch = item.nm_customers_contact?.toLowerCase().includes(query);
                        const companyMatch = item.nm_customers?.toLowerCase().includes(query);
                        const phoneMatch = item.customers_contact_phone?.toLowerCase().includes(query) || item.customers_contact_mobile?.toLowerCase().includes(query);
                        return nameMatch || companyMatch || phoneMatch;
                    });
                } else {
                    state.filteredData = action.payload;
                }
            })
            .addCase(fetchCustomerContacts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Delete
            .addCase(deleteCustomerContact.fulfilled, (state, action) => {
                state.data = state.data.filter(item => item.id_customers_contact !== action.payload);
                state.filteredData = state.filteredData.filter(item => item.id_customers_contact !== action.payload);
            });
    },
});

export const { setSearchQuery } = customerContactsSlice.actions;
export default customerContactsSlice.reducer;
