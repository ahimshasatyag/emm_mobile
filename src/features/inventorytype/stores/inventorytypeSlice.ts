import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InventoryTypeData } from '../types/inventorytype.types';

interface InventoryTypeState {
    data: InventoryTypeData[];
    isLoading: boolean;
    error: string | null;
}

const initialState: InventoryTypeState = {
    data: [],
    isLoading: false,
    error: null,
};

const inventorytypeSlice = createSlice({
    name: 'inventorytype',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setData: (state, action: PayloadAction<InventoryTypeData[]>) => {
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

export const { setLoading, setData, setError } = inventorytypeSlice.actions;
export default inventorytypeSlice.reducer;
