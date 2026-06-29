import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserData } from '../types/users.types';

interface UsersState {
    data: UserData[];
    isLoading: boolean;
    error: string | null;
}

const initialState: UsersState = {
    data: [],
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
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.isLoading = false;
        },
    },
});

export const { setData, setLoading, setError } = usersSlice.actions;
export default usersSlice.reducer;
