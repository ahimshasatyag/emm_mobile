import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ListSODetail, ListSOFilter, ListSOItem } from '../types/listso.types';
import { getSODetail, getSOList } from '../api/listsoApi';

interface ListSOState {
    items: ListSOItem[];
    currentDetail: ListSODetail | null;
    filters: ListSOFilter;
    isLoadingList: boolean;
    isLoadingDetail: boolean;
    error: string | null;
}

const initialState: ListSOState = {
    items: [],
    currentDetail: null,
    filters: {
        periode: new Date().toISOString().slice(0, 7), // e.g. "2026-07"
        id_customers: '',
        id_product: ''
    },
    isLoadingList: false,
    isLoadingDetail: false,
    error: null,
};

export const fetchSOList = createAsyncThunk(
    'listso/fetchList',
    async (filters: ListSOFilter) => {
        const data = await getSOList(filters);
        return data;
    }
);

export const fetchSODetail = createAsyncThunk(
    'listso/fetchDetail',
    async (id: string) => {
        const data = await getSODetail(id);
        return data;
    }
);

const listsoSlice = createSlice({
    name: 'listso',
    initialState,
    reducers: {
        setFilters(state, action: PayloadAction<Partial<ListSOFilter>>) {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearDetail(state) {
            state.currentDetail = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // List
            .addCase(fetchSOList.pending, (state) => {
                state.isLoadingList = true;
                state.error = null;
            })
            .addCase(fetchSOList.fulfilled, (state, action) => {
                state.isLoadingList = false;
                state.items = action.payload;
            })
            .addCase(fetchSOList.rejected, (state, action) => {
                state.isLoadingList = false;
                state.error = action.error.message || 'Failed to load SO list';
            })
            // Detail
            .addCase(fetchSODetail.pending, (state) => {
                state.isLoadingDetail = true;
                state.error = null;
            })
            .addCase(fetchSODetail.fulfilled, (state, action) => {
                state.isLoadingDetail = false;
                state.currentDetail = action.payload;
            })
            .addCase(fetchSODetail.rejected, (state, action) => {
                state.isLoadingDetail = false;
                state.error = action.error.message || 'Failed to load SO detail';
            });
    }
});

export const { setFilters, clearDetail } = listsoSlice.actions;
export default listsoSlice.reducer;
