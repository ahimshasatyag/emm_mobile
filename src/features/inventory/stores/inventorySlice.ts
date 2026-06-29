import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InventoryAsset, InventoryCategory, InventoryType } from '../types/inventory.types';

interface InventoryState {
    assets: InventoryAsset[];
    types: InventoryType[];
    categories: InventoryCategory[];
    isLoading: boolean;
    error: string | null;
}

const initialState: InventoryState = {
    assets: [],
    types: [],
    categories: [],
    isLoading: false,
    error: null,
};

const inventorySlice = createSlice({
    name: 'inventory',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
            state.error = null;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        setAssets: (state, action: PayloadAction<InventoryAsset[]>) => {
            state.assets = action.payload;
            state.isLoading = false;
            state.error = null;
        },
        setTypes: (state, action: PayloadAction<InventoryType[]>) => {
            state.types = action.payload;
        },
        setCategories: (state, action: PayloadAction<InventoryCategory[]>) => {
            state.categories = action.payload;
        },
        addAsset: (state, action: PayloadAction<InventoryAsset>) => {
            state.assets.unshift(action.payload);
            state.isLoading = false;
        },
        updateAsset: (state, action: PayloadAction<InventoryAsset>) => {
            const index = state.assets.findIndex(a => a.id === action.payload.id);
            if (index !== -1) {
                state.assets[index] = action.payload;
            }
            state.isLoading = false;
        },
        deleteAsset: (state, action: PayloadAction<string>) => {
            state.assets = state.assets.filter(a => a.id !== action.payload);
            state.isLoading = false;
        }
    }
});

export const {
    setLoading,
    setError,
    setAssets,
    setTypes,
    setCategories,
    addAsset,
    updateAsset,
    deleteAsset
} = inventorySlice.actions;

export default inventorySlice.reducer;
