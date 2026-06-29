import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserLevelData } from '../types/userslevel.types';

interface UsersLevelState {
    data: UserLevelData[];
    isLoading: boolean;
    error: string | null;
}

const initialState: UsersLevelState = {
    data: [],
    isLoading: false,
    error: null,
};

const userslevelSlice = createSlice({
    name: 'userslevel',
    initialState,
    reducers: {
        setData: (state, action: PayloadAction<UserLevelData[]>) => {
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

export const { setData, setLoading, setError } = userslevelSlice.actions;
export default userslevelSlice.reducer;
