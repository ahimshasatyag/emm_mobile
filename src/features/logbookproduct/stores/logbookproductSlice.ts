import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { LogbookProduct, LogbookProductState, MasterDataBarang, MasterDataTypeKerusakan } from '../types/logbookproduct.types';
import { logbookProductApi } from '../api/logbookProductApi';

const initialState: LogbookProductState = {
    list: [],
    current: null,
    masterDataBarang: [],
    masterDataTypeKerusakan: [],
    isLoading: false,
    error: null,
};

export const fetchLogbookProducts = createAsyncThunk(
    'logbookproduct/fetchList',
    async () => {
        return await logbookProductApi.getAll();
    }
);

export const fetchLogbookProductDetail = createAsyncThunk(
    'logbookproduct/fetchDetail',
    async (id: string) => {
        return await logbookProductApi.getById(id);
    }
);

export const fetchLogbookCreateMasterData = createAsyncThunk(
    'logbookproduct/fetchCreateMasterData',
    async () => {
        return await logbookProductApi.getCreateMasterData();
    }
);

export const createLogbookProduct = createAsyncThunk(
    'logbookproduct/create',
    async (payload: any) => {
        return await logbookProductApi.create(payload);
    }
);

export const updateLogbookProduct = createAsyncThunk(
    'logbookproduct/update',
    async (payload: any) => {
        return await logbookProductApi.update(payload);
    }
);

export const deleteLogbookProduct = createAsyncThunk(
    'logbookproduct/delete',
    async (id: string) => {
        return await logbookProductApi.delete(id);
    }
);

const logbookProductSlice = createSlice({
    name: 'logbookproduct',
    initialState,
    reducers: {
        clearCurrent: (state) => {
            state.current = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLogbookProducts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchLogbookProducts.fulfilled, (state, action: PayloadAction<LogbookProduct[]>) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(fetchLogbookProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch';
            })
            .addCase(fetchLogbookProductDetail.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchLogbookProductDetail.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload) {
                    state.current = action.payload.data;
                    state.masterDataBarang = action.payload.data_barang;
                    state.masterDataTypeKerusakan = action.payload.data_type_kerusakan;
                }
            })
            .addCase(fetchLogbookProductDetail.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch detail';
            })
            .addCase(fetchLogbookCreateMasterData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchLogbookCreateMasterData.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload) {
                    state.masterDataBarang = action.payload.data_barang;
                    state.masterDataTypeKerusakan = action.payload.data_type_kerusakan;
                }
            })
            .addCase(fetchLogbookCreateMasterData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch master data';
            });
    }
});

export const { clearCurrent } = logbookProductSlice.actions;
export default logbookProductSlice.reducer;
