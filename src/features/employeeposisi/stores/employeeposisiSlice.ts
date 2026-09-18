import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { EmployeePosisi } from '../types/employeeposisi.types';
import { employeePosisiApi } from '../api/employeeposisi.api';

interface EmployeePosisiState {
    data: EmployeePosisi[];
    filteredData: EmployeePosisi[];
    isLoading: boolean;
    error: string | null;
    searchQuery: string;
}

const initialState: EmployeePosisiState = {
    data: [],
    filteredData: [],
    isLoading: false,
    error: null,
    searchQuery: '',
};

export const fetchEmployeePosisis = createAsyncThunk(
    'employeePosisi/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await employeePosisiApi.fetchEmployeePosisis();
            if (response.success && response.data) {
                return response.data;
            }
            return rejectWithValue(response.message || 'Gagal mengambil data posisi karyawan');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Gagal mengambil data posisi karyawan');
        }
    }
);

export const deleteEmployeePosisi = createAsyncThunk(
    'employeePosisi/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await employeePosisiApi.deleteEmployeePosisi(id);
            if (response.success) {
                return id;
            }
            return rejectWithValue(response.message || 'Gagal menghapus posisi karyawan');
        } catch (error: any) {
            return rejectWithValue(error.message || 'Gagal menghapus posisi karyawan');
        }
    }
);

const employeePosisiSlice = createSlice({
    name: 'employeePosisi',
    initialState,
    reducers: {
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
            const query = action.payload.toLowerCase();
            if (!query) {
                state.filteredData = state.data;
            } else {
                state.filteredData = state.data.filter(
                    (item) => item.nm_karyawan_posisi.toLowerCase().includes(query)
                );
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEmployeePosisis.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchEmployeePosisis.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
                
                if (state.searchQuery) {
                    const query = state.searchQuery.toLowerCase();
                    state.filteredData = action.payload.filter(
                        (item) => item.nm_karyawan_posisi.toLowerCase().includes(query)
                    );
                } else {
                    state.filteredData = action.payload;
                }
            })
            .addCase(fetchEmployeePosisis.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteEmployeePosisi.fulfilled, (state, action) => {
                state.data = state.data.filter(item => item.id_karyawan_posisi !== action.payload);
                state.filteredData = state.filteredData.filter(item => item.id_karyawan_posisi !== action.payload);
            });
    },
});

export const { setSearchQuery } = employeePosisiSlice.actions;
export default employeePosisiSlice.reducer;
