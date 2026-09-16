import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { DivisionSopSummary, SopItem, SopDetail } from '../types/sop.types';
import { sopApi } from '../api/sopApi';

interface SopState {
    divisions: DivisionSopSummary[];
    sops: SopItem[];
    currentSop: SopDetail | null;
    loading: boolean;
    error: string | null;
}

const initialState: SopState = {
    divisions: [],
    sops: [],
    currentSop: null,
    loading: false,
    error: null,
};

export const fetchDivisions = createAsyncThunk('sop/fetchDivisions', async () => {
    return await sopApi.fetchDivisions();
});

export const fetchSopsByDivisi = createAsyncThunk('sop/fetchSopsByDivisi', async (divisi: string) => {
    return await sopApi.fetchSopsByDivisi(divisi);
});

export const fetchSopById = createAsyncThunk('sop/fetchSopById', async (id: string) => {
    return await sopApi.fetchSopById(id);
});

export const addSop = createAsyncThunk('sop/addSop', async (payload: FormData) => {
    return await sopApi.addSop(payload);
});

export const updateSop = createAsyncThunk('sop/updateSop', async (payload: FormData) => {
    return await sopApi.updateSop(payload);
});

export const confirmSop = createAsyncThunk('sop/confirmSop', async (id: string) => {
    return await sopApi.confirmSop(id);
});

const sopSlice = createSlice({
    name: 'sop',
    initialState,
    reducers: {
        clearCurrentSop: (state) => {
            state.currentSop = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Divisions
            .addCase(fetchDivisions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDivisions.fulfilled, (state, action: PayloadAction<DivisionSopSummary[]>) => {
                state.loading = false;
                state.divisions = action.payload;
            })
            .addCase(fetchDivisions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch divisions';
            })
            
            // Fetch SOPs by Divisi
            .addCase(fetchSopsByDivisi.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSopsByDivisi.fulfilled, (state, action: PayloadAction<SopItem[]>) => {
                state.loading = false;
                state.sops = action.payload;
            })
            .addCase(fetchSopsByDivisi.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch SOPs';
            })

            // Fetch SOP by ID
            .addCase(fetchSopById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSopById.fulfilled, (state, action: PayloadAction<SopDetail | undefined>) => {
                state.loading = false;
                if (action.payload) {
                    state.currentSop = action.payload;
                }
            })
            .addCase(fetchSopById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch SOP';
            });
    }
});

export const { clearCurrentSop } = sopSlice.actions;
export default sopSlice.reducer;
