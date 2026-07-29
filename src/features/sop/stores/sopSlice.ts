import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { DivisionSopSummary, SopItem } from '../types/sop.types';
import { sopApi } from '../api/sopApi';

interface SopState {
    divisions: DivisionSopSummary[];
    sops: SopItem[];
    currentSop: SopItem | null;
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

export const addSop = createAsyncThunk('sop/addSop', async (payload: Omit<SopItem, 'id_sop' | 'status' | 'history' | 'date_create'>) => {
    return await sopApi.addSop(payload);
});

export const updateSop = createAsyncThunk('sop/updateSop', async ({ id, payload }: { id: string, payload: Partial<SopItem> }) => {
    return await sopApi.updateSop(id, payload);
});

export const confirmSop = createAsyncThunk('sop/confirmSop', async (id: string) => {
    return await sopApi.confirmSop(id);
});

export const revisiSop = createAsyncThunk('sop/revisiSop', async (id: string) => {
    return await sopApi.revisiSop(id);
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
            .addCase(fetchSopById.fulfilled, (state, action: PayloadAction<SopItem | undefined>) => {
                state.loading = false;
                if (action.payload) {
                    state.currentSop = action.payload;
                }
            })
            .addCase(fetchSopById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch SOP';
            })

            // Add SOP
            .addCase(addSop.fulfilled, (state, action: PayloadAction<SopItem>) => {
                state.sops.push(action.payload);
                // Also update division count locally
                const index = state.divisions.findIndex(d => d.divisi === action.payload.divisi);
                if (index !== -1) {
                    state.divisions[index] = {
                        ...state.divisions[index],
                        total: state.divisions[index].total + 1
                    };
                }
            })

            // Update SOP
            .addCase(updateSop.fulfilled, (state, action: PayloadAction<SopItem>) => {
                const index = state.sops.findIndex(s => s.id_sop === action.payload.id_sop);
                if (index !== -1) {
                    state.sops[index] = action.payload;
                }
                if (state.currentSop?.id_sop === action.payload.id_sop) {
                    state.currentSop = action.payload;
                }
            })

            // Confirm SOP
            .addCase(confirmSop.fulfilled, (state, action: PayloadAction<SopItem>) => {
                const index = state.sops.findIndex(s => s.id_sop === action.payload.id_sop);
                if (index !== -1) {
                    state.sops[index] = action.payload;
                }
                if (state.currentSop?.id_sop === action.payload.id_sop) {
                    state.currentSop = action.payload;
                }
            })

            // Revisi SOP
            .addCase(revisiSop.fulfilled, (state, action: PayloadAction<SopItem>) => {
                const index = state.sops.findIndex(s => s.id_sop === action.payload.id_sop);
                if (index !== -1) {
                    state.sops[index] = action.payload;
                }
                if (state.currentSop?.id_sop === action.payload.id_sop) {
                    state.currentSop = action.payload;
                }
            });
    }
});

export const { clearCurrentSop } = sopSlice.actions;
export default sopSlice.reducer;
