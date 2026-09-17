import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EmployeeDivisiData } from '../types/employeedivisi.types';

interface EmployeeDivisiState {
    data: EmployeeDivisiData[];
    isLoading: boolean;
    error: string | null;
}

const initialState: EmployeeDivisiState = {
    data: [],
    isLoading: false,
    error: null,
};

const employeedivisiSlice = createSlice({
    name: 'employeedivisi',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setData: (state, action: PayloadAction<EmployeeDivisiData[]>) => {
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

export const { setLoading, setData, setError } = employeedivisiSlice.actions;
export default employeedivisiSlice.reducer;
