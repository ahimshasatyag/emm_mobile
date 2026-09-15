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
    async (search: string | undefined, { rejectWithValue }) => {
        try {
            return await poAPI.fetchList(search);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchPoById = createAsyncThunk(
    'po/fetchById',
    async (id: string, { rejectWithValue }) => {
        try {
            return await poAPI.fetchDetail(id);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const createPo = createAsyncThunk(
    'po/create',
    async (data: FormData, { rejectWithValue }) => {
        try {
            return await poAPI.create(data);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const updatePo = createAsyncThunk(
    'po/update',
    async ({ id, data }: { id: string, data: FormData }, { rejectWithValue }) => {
        try {
            return await poAPI.update(id, data);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const confirmPo = createAsyncThunk(
    'po/confirm',
    async (id: string, { rejectWithValue }) => {
        try {
            return await poAPI.confirm(id);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const cancelPo = createAsyncThunk(
    'po/cancel',
    async (id: string, { rejectWithValue }) => {
        try {
            return await poAPI.cancel(id);
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

        // Saving states
        builder.addMatcher(
            (action) => action.type.startsWith('po/') && action.type.endsWith('/pending') && !['po/fetchAll/pending', 'po/fetchById/pending'].includes(action.type),
            (state) => {
                state.isSaving = true;
                state.error = null;
            }
        );
        builder.addMatcher(
            (action) => action.type.startsWith('po/') && action.type.endsWith('/fulfilled') && !['po/fetchAll/fulfilled', 'po/fetchById/fulfilled'].includes(action.type),
            (state) => {
                state.isSaving = false;
            }
        );
        builder.addMatcher(
            (action) => action.type.startsWith('po/') && action.type.endsWith('/rejected') && !['po/fetchAll/rejected', 'po/fetchById/rejected'].includes(action.type),
            (state, action) => {
                state.isSaving = false;
                state.error = action.payload as string;
            }
        );
    },
});

export const { clearSelectedItem, clearError } = poSlice.actions;
export default poSlice.reducer;
