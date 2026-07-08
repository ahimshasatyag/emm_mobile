import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { LeadsItem, LeadsDetail } from '../types/leads.types';
import { fetchLeads, fetchLeadDetail } from '../api/leads.api';

interface LeadsState {
    items: LeadsItem[];
    currentDetail: LeadsDetail | null;
    isLoadingList: boolean;
    isLoadingDetail: boolean;
    error: string | null;
}

const initialState: LeadsState = {
    items: [],
    currentDetail: null,
    isLoadingList: false,
    isLoadingDetail: false,
    error: null,
};

export const fetchLeadsList = createAsyncThunk(
    'leads/fetchList',
    async (_, { rejectWithValue }) => {
        try {
            const data = await fetchLeads();
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch leads');
        }
    }
);

export const fetchLeadsDetail = createAsyncThunk(
    'leads/fetchDetail',
    async (id: string, { rejectWithValue }) => {
        try {
            const data = await fetchLeadDetail(id);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch lead detail');
        }
    }
);

const leadsSlice = createSlice({
    name: 'leads',
    initialState,
    reducers: {
        clearDetail: (state) => {
            state.currentDetail = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // List
            .addCase(fetchLeadsList.pending, (state) => {
                state.isLoadingList = true;
                state.error = null;
            })
            .addCase(fetchLeadsList.fulfilled, (state, action) => {
                state.isLoadingList = false;
                state.items = action.payload;
            })
            .addCase(fetchLeadsList.rejected, (state, action) => {
                state.isLoadingList = false;
                state.error = action.payload as string;
            })
            // Detail
            .addCase(fetchLeadsDetail.pending, (state) => {
                state.isLoadingDetail = true;
                state.error = null;
            })
            .addCase(fetchLeadsDetail.fulfilled, (state, action) => {
                state.isLoadingDetail = false;
                state.currentDetail = action.payload;
            })
            .addCase(fetchLeadsDetail.rejected, (state, action) => {
                state.isLoadingDetail = false;
                state.error = action.payload as string;
            });
    }
});

export const { clearDetail } = leadsSlice.actions;
export default leadsSlice.reducer;
