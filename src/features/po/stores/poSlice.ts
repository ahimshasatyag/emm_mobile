import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PoHeader } from '../types/po.types';
import { poAPI } from '../api/poAPI';

interface PoState {
    items: PoHeader[];
    selectedItem: PoHeader | null;
    isLoadingList: boolean;
    isLoadingDetail: boolean;
    isSaving: boolean;
    error: string | null;
}

const initialState: PoState = {
    items: [],
    selectedItem: null,
    isLoadingList: false,
    isLoadingDetail: false,
    isSaving: false,
    error: null,
};

export const fetchPoList = createAsyncThunk(
    'po/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await poAPI.fetchPoList();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchPoById = createAsyncThunk(
    'po/fetchById',
    async (id: string, { rejectWithValue }) => {
        try {
            return await poAPI.fetchPoDetail(id);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const savePo = createAsyncThunk(
    'po/save',
    async (data: any, { rejectWithValue }) => {
        try {
            return await poAPI.savePo(data);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const poSlice = createSlice({
    name: 'po',
    initialState,
    reducers: {
        clearSelectedItem: (state) => {
            state.selectedItem = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchPoList.pending, (state) => {
            state.isLoadingList = true;
            state.error = null;
        });
        builder.addCase(fetchPoList.fulfilled, (state, action) => {
            state.isLoadingList = false;
            state.items = action.payload;
        });
        builder.addCase(fetchPoList.rejected, (state, action) => {
            state.isLoadingList = false;
            state.error = action.payload as string;
        });

        builder.addCase(fetchPoById.pending, (state) => {
            state.isLoadingDetail = true;
            state.error = null;
        });
        builder.addCase(fetchPoById.fulfilled, (state, action) => {
            state.isLoadingDetail = false;
            state.selectedItem = action.payload;
        });
        builder.addCase(fetchPoById.rejected, (state, action) => {
            state.isLoadingDetail = false;
            state.error = action.payload as string;
        });

        builder.addCase(savePo.pending, (state) => {
            state.isSaving = true;
            state.error = null;
        });
        builder.addCase(savePo.fulfilled, (state, action) => {
            state.isSaving = false;
        });
        builder.addCase(savePo.rejected, (state, action) => {
            state.isSaving = false;
            state.error = action.payload as string;
        });
    }
});

export const { clearSelectedItem, clearError } = poSlice.actions;
export default poSlice.reducer;
