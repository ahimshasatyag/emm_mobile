import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SettingData } from '../types/setting.types';

interface SettingState {
    data: SettingData[];
    isLoading: boolean;
    error: string | null;
}

const initialState: SettingState = {
    data: [],
    isLoading: false,
    error: null,
};

const settingSlice = createSlice({
    name: 'setting',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setData: (state, action: PayloadAction<SettingData[]>) => {
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

export const { setLoading, setData, setError } = settingSlice.actions;
export default settingSlice.reducer;
