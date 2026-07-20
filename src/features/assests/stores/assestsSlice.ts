import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AssetItem, AssetCategory, AssetType } from '../types/assests.types';
import { fetchAssets, fetchAssetCategories, fetchAssetTypes, saveAsset } from '../api/assestsApi';

interface AssestsState {
    items: AssetItem[];
    categories: AssetCategory[];
    types: AssetType[];
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;
}

const initialState: AssestsState = {
    items: [],
    categories: [],
    types: [],
    isLoading: false,
    isSaving: false,
    error: null,
};

export const loadAssetsData = createAsyncThunk(
    'assests/loadData',
    async (_, { rejectWithValue }) => {
        try {
            const [assets, categories, types] = await Promise.all([
                fetchAssets(),
                fetchAssetCategories(),
                fetchAssetTypes()
            ]);
            return { assets, categories, types };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const submitAsset = createAsyncThunk(
    'assests/submit',
    async (asset: Partial<AssetItem>, { rejectWithValue }) => {
        try {
            const response = await saveAsset(asset);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const assestsSlice = createSlice({
    name: 'assests',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadAssetsData.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loadAssetsData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload.assets;
                state.categories = action.payload.categories;
                state.types = action.payload.types;
            })
            .addCase(loadAssetsData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(submitAsset.pending, (state) => {
                state.isSaving = true;
                state.error = null;
            })
            .addCase(submitAsset.fulfilled, (state, action) => {
                state.isSaving = false;
                // Since this is mock, we just prepend it
                state.items = [action.payload, ...state.items];
            })
            .addCase(submitAsset.rejected, (state, action) => {
                state.isSaving = false;
                state.error = action.payload as string;
            });
    }
});

export default assestsSlice.reducer;
