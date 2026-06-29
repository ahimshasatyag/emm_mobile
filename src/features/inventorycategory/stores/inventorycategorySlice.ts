import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InventoryCategoryData } from '../types/inventorycategory.types';

interface InventoryCategoryState {
    data: InventoryCategoryData[];
    isLoading: boolean;
    error: string | null;
}

const initialState: InventoryCategoryState = {
    data: [],
    isLoading: false,
    error: null,
};

const inventorycategorySlice = createSlice({
    name: 'inventorycategory',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setData: (state, action: PayloadAction<InventoryCategoryData[]>) => {
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

export const { setLoading, setData, setError } = inventorycategorySlice.actions;
export default inventorycategorySlice.reducer;
