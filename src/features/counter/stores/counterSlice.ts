import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CounterData } from '../types/counter.types';

interface CounterState {
    data: CounterData[];
    isLoading: boolean;
    error: string | null;
}

const initialState: CounterState = {
    data: [],
    isLoading: false,
    error: null,
};

const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setData: (state, action: PayloadAction<CounterData[]>) => {
            state.data = action.payload;
            state.isLoading = false;
            state.error = null;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.isLoading = false;
        },
    },
});

export const { setLoading, setData, setError } = counterSlice.actions;
export default counterSlice.reducer;
