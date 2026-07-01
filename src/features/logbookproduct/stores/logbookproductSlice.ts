import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { LogbookProduct, LogbookProductState } from '../types/logbookproduct.types';

// Dummy initial data mimicking PHP DB
const DUMMY_DATA: LogbookProduct[] = [
    {
        id_log_book: 'LB-202507-001',
        id_product: '1',
        nm_product: 'Mesin Kopi Espresso',
        code_product: 'PRD-001',
        id_type_kerusakan: '1',
        nm_type_kerusakan: 'Mekanik',
        date_log_book: '2025-07-18',
        masalah: 'Air tidak mau keluar dari portafilter',
        solusi: 'Pembersihan saluran air dan penggantian seal',
        catatan: 'Perlu maintenance rutin tiap bulan',
        username: 'Agung',
        date_entry: '2025-07-18 10:00:00'
    },
    {
        id_log_book: 'LB-202507-002',
        id_product: '2',
        nm_product: 'Mesin Grinder',
        code_product: 'PRD-002',
        id_type_kerusakan: '2',
        nm_type_kerusakan: 'Elektrik',
        date_log_book: '2025-07-19',
        masalah: 'Motor grinder tidak berputar',
        solusi: 'Ganti kapasitor motor',
        catatan: 'Cek tegangan listrik outlet',
        username: 'Agung',
        date_entry: '2025-07-19 14:30:00'
    }
];

const initialState: LogbookProductState = {
    list: [],
    current: null,
    isLoading: false,
    error: null,
};

export const fetchLogbookProducts = createAsyncThunk(
    'logbookproduct/fetchList',
    async () => {
        // Simulate API call
        return new Promise<LogbookProduct[]>((resolve) => {
            setTimeout(() => {
                resolve(DUMMY_DATA);
            }, 800);
        });
    }
);

export const fetchLogbookProductDetail = createAsyncThunk(
    'logbookproduct/fetchDetail',
    async (id: string) => {
        // Simulate API call
        return new Promise<LogbookProduct | null>((resolve) => {
            setTimeout(() => {
                const found = DUMMY_DATA.find(item => item.id_log_book === id);
                resolve(found || null);
            }, 500);
        });
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
            .addCase(fetchLogbookProductDetail.fulfilled, (state, action: PayloadAction<LogbookProduct | null>) => {
                state.isLoading = false;
                state.current = action.payload;
            });
    }
});

export const { clearCurrent } = logbookProductSlice.actions;
export default logbookProductSlice.reducer;
