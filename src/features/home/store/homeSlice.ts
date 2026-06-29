import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HomeData } from '../types/home.types';

interface HomeState {
    data: HomeData | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: HomeState = {
    data: null,
    isLoading: true,
    error: null,
};

const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {
        setData: (state, action: PayloadAction<HomeData>) => {
            state.data = action.payload;
            state.error = null;
            state.isLoading = false;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.isLoading = false;
        },
    },
});

export const { setData, setLoading, setError } = homeSlice.actions;
export default homeSlice.reducer;
