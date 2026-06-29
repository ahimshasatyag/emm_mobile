import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProfileData } from '../types/profile.types';

interface ProfileState {
    data: ProfileData | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: ProfileState = {
    data: null,
    isLoading: true,
    error: null,
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setData: (state, action: PayloadAction<ProfileData>) => {
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

export const { setData, setLoading, setError } = profileSlice.actions;
export default profileSlice.reducer;
