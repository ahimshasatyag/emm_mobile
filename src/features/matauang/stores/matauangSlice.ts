import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { MataUangItem } from '../types/matauang.types';
import { fetchMataUang } from '../api/matauangApi';

interface MataUangState {
    items: MataUangItem[];
    isLoading: boolean;
    error: string | null;
    baseCurrency: string;
}

const initialState: MataUangState = {
    items: [],
    isLoading: false,
    error: null,
    baseCurrency: 'USD',
};

export const fetchMataUangData = createAsyncThunk(
    'matauang/fetchMataUangData',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchMataUang();
            if (response.status) {
                return response.data;
            }
            return rejectWithValue('Gagal mengambil data mata uang');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Terjadi kesalahan');
        }
    }
);

const matauangSlice = createSlice({
    name: 'matauang',
    initialState,
    reducers: {
        setBaseCurrency: (state, action: PayloadAction<string>) => {
            state.baseCurrency = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMataUangData.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchMataUangData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(fetchMataUangData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    }
});

export const { setBaseCurrency } = matauangSlice.actions;
export default matauangSlice.reducer;
