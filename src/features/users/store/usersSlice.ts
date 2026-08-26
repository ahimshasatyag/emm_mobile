import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserData, UserLevel } from '../types/users.types';

interface UsersState {
    data: UserData[];
    levels: UserLevel[];
    isLoading: boolean;
    error: string | null;
}

const initialState: UsersState = {
    data: [],
    levels: [],
    isLoading: false,
    error: null,
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setData: (state, action: PayloadAction<UserData[]>) => {
            state.data = action.payload;
            state.error = null;
            state.isLoading = false;
        },
        setLevels: (state, action: PayloadAction<UserLevel[]>) => {
            state.levels = action.payload;
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

export const { setData, setLevels, setLoading, setError } = usersSlice.actions;
export default usersSlice.reducer;
