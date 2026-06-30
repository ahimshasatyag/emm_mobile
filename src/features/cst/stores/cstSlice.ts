import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Cst, CstDetail } from '../types/cst.types';
import * as cstApi from '../api/cst.api';

interface CstState {
    cstList: Cst[];
    currentCst: CstDetail | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: CstState = {
    cstList: [],
    currentCst: null,
    isLoading: false,
    error: null,
};

export const fetchCstList = createAsyncThunk(
    'cst/fetchList',
    async (_, { rejectWithValue }) => {
        try {
            return await cstApi.fetchCstList();
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch CST list');
        }
    }
);

export const fetchCstDetail = createAsyncThunk(
    'cst/fetchDetail',
    async (cst_code: string, { rejectWithValue }) => {
        try {
            return await cstApi.fetchCstDetail(cst_code);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch CST detail');
        }
    }
);

export const closeCst = createAsyncThunk(
    'cst/close',
    async (cst_code: string, { rejectWithValue }) => {
        try {
            await cstApi.closeCst(cst_code);
            return cst_code;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to close CST');
        }
    }
);

export const cancelCst = createAsyncThunk(
    'cst/cancel',
    async (cst_code: string, { rejectWithValue }) => {
        try {
            await cstApi.cancelCst(cst_code);
            return cst_code;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to cancel CST');
        }
    }
);

const cstSlice = createSlice({
    name: 'cst',
    initialState,
    reducers: {
        clearCurrentCst: (state) => {
            state.currentCst = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetchList
            .addCase(fetchCstList.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCstList.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cstList = action.payload;
            })
            .addCase(fetchCstList.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // fetchDetail
            .addCase(fetchCstDetail.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCstDetail.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentCst = action.payload;
            })
            .addCase(fetchCstDetail.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // close
            .addCase(closeCst.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(closeCst.fulfilled, (state, action) => {
                state.isLoading = false;
                if (state.currentCst && state.currentCst.cst_code === action.payload) {
                    state.currentCst.status = 'DONE';
                }
                const index = state.cstList.findIndex(c => c.cst_code === action.payload);
                if (index !== -1) {
                    state.cstList[index].status = 'DONE';
                }
            })
            .addCase(closeCst.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // cancel
            .addCase(cancelCst.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(cancelCst.fulfilled, (state, action) => {
                state.isLoading = false;
                if (state.currentCst && state.currentCst.cst_code === action.payload) {
                    state.currentCst.status = 'CANCEL';
                    state.currentCst.f_cancel = 1;
                }
                const index = state.cstList.findIndex(c => c.cst_code === action.payload);
                if (index !== -1) {
                    state.cstList[index].status = 'CANCEL';
                    state.cstList[index].f_cancel = 1;
                }
            })
            .addCase(cancelCst.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearCurrentCst } = cstSlice.actions;
export default cstSlice.reducer;
