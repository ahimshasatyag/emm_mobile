import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LktDetail, LktFilter } from '../types/lkt.types';

interface LktState {
    items: LktDetail[];
    currentLkt: LktDetail | null;
    isLoading: boolean;
    error: string | null;
    filter: LktFilter;
}

const initialState: LktState = {
    items: [],
    currentLkt: null,
    isLoading: false,
    error: null,
    filter: {
        statusFilter: 'ALL',
        isAll: true,
        searchQuery: ''
    }
};

const lktSlice = createSlice({
    name: 'lkt',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setItems: (state, action: PayloadAction<LktDetail[]>) => {
            state.items = action.payload;
        },
        setCurrentLkt: (state, action: PayloadAction<LktDetail | null>) => {
            state.currentLkt = action.payload;
        },
        setFilter: (state, action: PayloadAction<Partial<LktFilter>>) => {
            state.filter = { ...state.filter, ...action.payload };
        }
    }
});

export const { setLoading, setError, setItems, setCurrentLkt, setFilter } = lktSlice.actions;
export default lktSlice.reducer;
