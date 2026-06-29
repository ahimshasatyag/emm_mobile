import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UsersLogData } from '../types/userslog.types';

interface UsersLogState {
    data: UsersLogData[];
    isLoading: boolean;
    error: string | null;
}

const initialState: UsersLogState = {
    data: [],
    isLoading: false,
    error: null,
};

const userslogSlice = createSlice({
    name: 'userslog',
    initialState,
    reducers: {
        setData: (state, action: PayloadAction<UsersLogData[]>) => {
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

export const { setData, setLoading, setError } = userslogSlice.actions;
export default userslogSlice.reducer;
