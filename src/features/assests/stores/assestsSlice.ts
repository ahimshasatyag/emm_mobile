import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AssetItem, AssetCategory, AssetType, AssetSavePayload } from '../types/assests.types';
import { fetchAssets, fetchAssetSupportData, saveAsset } from '../api/assestsApi';

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
            const [assets, supportData] = await Promise.all([
                fetchAssets(),
                fetchAssetSupportData()
            ]);
            return { 
                assets, 
                categories: supportData.categories, 
                types: supportData.types 
            };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to load assets data');
        }
    }
);

export const submitAsset = createAsyncThunk(
    'assests/submit',
    async ({ id, payload }: { id?: string | null, payload: AssetSavePayload }, { dispatch, rejectWithValue }) => {
        try {
            const response = await saveAsset(id, payload);
            if (response && response.status) {
                // Reload list to get the updated records from backend
                dispatch(loadAssetsData());
            }
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to save asset');
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
            })
            .addCase(submitAsset.rejected, (state, action) => {
                state.isSaving = false;
                state.error = action.payload as string;
            });
    }
});

export default assestsSlice.reducer;
