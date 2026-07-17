import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { KasBankInHeader, KasBankInDetail, Bank, Coa, SalesOrder } from '../types/kasbankin.types';
import { kasbankinApi } from '../api/kasbankinApi';

interface KasBankInState {
    kasBankIns: KasBankInHeader[];
    banks: Bank[];
    coas: Coa[];
    sos: SalesOrder[];
    
    currentHeader: Partial<KasBankInHeader> | null;
    currentDetails: Partial<KasBankInDetail>[];
    
    isLoading: boolean;
    isSubmitting: boolean;
    error: string | null;
}

const initialState: KasBankInState = {
    kasBankIns: [],
    banks: [],
    coas: [],
    sos: [],
    currentHeader: null,
    currentDetails: [],
    isLoading: false,
    isSubmitting: false,
    error: null,
};

export const fetchKasBankIns = createAsyncThunk('kasbankin/fetchKasBankIns', async () => {
    return await kasbankinApi.fetchKasBankInList();
});

export const fetchMasterData = createAsyncThunk('kasbankin/fetchMasterData', async () => {
    const [banks, coas, sos] = await Promise.all([
        kasbankinApi.fetchBanks(),
        kasbankinApi.fetchCoas(),
        kasbankinApi.fetchSalesOrders(),
    ]);
    return { banks, coas, sos };
});

export const fetchKasBankInById = createAsyncThunk('kasbankin/fetchKasBankInById', async (id: string) => {
    return await kasbankinApi.fetchKasBankInById(id);
});

export const saveKasBankIn = createAsyncThunk('kasbankin/saveKasBankIn', async (data: { header: Partial<KasBankInHeader>, details: Partial<KasBankInDetail>[] }) => {
    return await kasbankinApi.saveKasBankIn(data);
});

const kasbankinSlice = createSlice({
    name: 'kasbankin',
    initialState,
    reducers: {
        clearCurrentKasBankIn(state) {
            state.currentHeader = null;
            state.currentDetails = [];
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch List
            .addCase(fetchKasBankIns.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchKasBankIns.fulfilled, (state, action) => {
                state.isLoading = false;
                state.kasBankIns = action.payload;
            })
            .addCase(fetchKasBankIns.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch kas bank in list';
            })
            // Fetch Master Data
            .addCase(fetchMasterData.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchMasterData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.banks = action.payload.banks;
                state.coas = action.payload.coas;
                state.sos = action.payload.sos;
            })
            .addCase(fetchMasterData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch master data';
            })
            // Fetch By ID
            .addCase(fetchKasBankInById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchKasBankInById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentHeader = action.payload.header;
                state.currentDetails = action.payload.details;
            })
            .addCase(fetchKasBankInById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch kas bank in detail';
            })
            // Save Kas Bank In
            .addCase(saveKasBankIn.pending, (state) => {
                state.isSubmitting = true;
                state.error = null;
            })
            .addCase(saveKasBankIn.fulfilled, (state) => {
                state.isSubmitting = false;
            })
            .addCase(saveKasBankIn.rejected, (state, action) => {
                state.isSubmitting = false;
                state.error = action.error.message || 'Failed to save kas bank in';
            });
    }
});

export const { clearCurrentKasBankIn } = kasbankinSlice.actions;
export default kasbankinSlice.reducer;
