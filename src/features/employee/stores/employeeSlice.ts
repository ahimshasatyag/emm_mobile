import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { EmployeeData } from '../types/employee.types';
import { fetchEmployeesApi, deleteEmployeeApi } from '../api/employee.api';

interface EmployeeState {
    data: EmployeeData[];
    filteredData: EmployeeData[];
    isLoading: boolean;
    error: string | null;
    searchQuery: string;
}

const initialState: EmployeeState = {
    data: [],
    filteredData: [],
    isLoading: false,
    error: null,
    searchQuery: '',
};

export const fetchEmployees = createAsyncThunk(
    'employee/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const data = await fetchEmployeesApi();
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Gagal mengambil data karyawan');
        }
    }
);

export const deleteEmployee = createAsyncThunk(
    'employee/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            await deleteEmployeeApi(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Gagal menghapus karyawan');
        }
    }
);

const employeeSlice = createSlice({
    name: 'employee',
    initialState,
    reducers: {
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
            const query = action.payload.toLowerCase();
            if (!query) {
                state.filteredData = state.data;
            } else {
                state.filteredData = state.data.filter(
                    (item) => 
                        item.nm_karyawan.toLowerCase().includes(query) || 
                        item.nm_karyawan_divisi?.toLowerCase().includes(query) ||
                        item.nm_karyawan_posisi?.toLowerCase().includes(query) ||
                        item.no_hp.includes(query)
                );
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEmployees.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchEmployees.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
                
                // Re-apply filter if exists
                if (state.searchQuery) {
                    const query = state.searchQuery.toLowerCase();
                    state.filteredData = action.payload.filter(
                        (item) => 
                            item.nm_karyawan.toLowerCase().includes(query) || 
                            item.nm_karyawan_divisi?.toLowerCase().includes(query) ||
                            item.nm_karyawan_posisi?.toLowerCase().includes(query) ||
                            item.no_hp.includes(query)
                    );
                } else {
                    state.filteredData = action.payload;
                }
            })
            .addCase(fetchEmployees.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteEmployee.fulfilled, (state, action) => {
                state.data = state.data.filter(item => item.id_karyawan !== action.payload);
                state.filteredData = state.filteredData.filter(item => item.id_karyawan !== action.payload);
            });
    },
});

export const { setSearchQuery } = employeeSlice.actions;
export default employeeSlice.reducer;
