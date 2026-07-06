import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SalesContract, SOWithoutContract } from '../types/salescontract.types';
import { salescontractApi } from '../api/salescontractApi';

interface SalesContractState {
    items: SalesContract[];
    soWithoutContracts: SOWithoutContract[];
    currentContract: SalesContract | null;
    currentSOWithoutContract: SOWithoutContract | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: SalesContractState = {
    items: [],
    soWithoutContracts: [],
    currentContract: null,
    currentSOWithoutContract: null,
    isLoading: false,
    error: null,
};

export const fetchSalesContracts = createAsyncThunk(
    'salescontract/fetchList',
    async (_, { rejectWithValue }) => {
        try {
            return await salescontractApi.fetchSalesContracts();
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch sales contracts');
        }
    }
);

export const getSalesContractById = createAsyncThunk(
    'salescontract/getById',
    async (id: string, { rejectWithValue }) => {
        try {
            const data = await salescontractApi.getSalesContractById(id);
            if (!data) throw new Error("Sales Contract not found");
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch sales contract detail');
        }
    }
);

export const fetchSOWithoutContractList = createAsyncThunk(
    'salescontract/fetchSOWithoutContractList',
    async (_, { rejectWithValue }) => {
        try {
            return await salescontractApi.fetchSOWithoutContract();
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch SO list');
        }
    }
);

export const getSOWithoutContractById = createAsyncThunk(
    'salescontract/getSOWithoutContractById',
    async (id: string, { rejectWithValue }) => {
        try {
            const data = await salescontractApi.getSOWithoutContractById(id);
            if (!data) throw new Error("SO not found");
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch SO detail');
        }
    }
);

export const createSalesContract = createAsyncThunk(
    'salescontract/create',
    async (data: SalesContract, { rejectWithValue }) => {
        try {
            return await salescontractApi.createSalesContract(data);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to create Sales Contract');
        }
    }
);

export const updateSalesContract = createAsyncThunk(
    'salescontract/update',
    async ({ id, data }: { id: string; data: Partial<SalesContract> }, { rejectWithValue }) => {
        try {
            return await salescontractApi.updateSalesContract(id, data);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to update Sales Contract');
        }
    }
);

const salescontractSlice = createSlice({
    name: 'salescontract',
    initialState,
    reducers: {
        clearCurrentContract: (state) => {
            state.currentContract = null;
        },
        clearCurrentSOWithoutContract: (state) => {
            state.currentSOWithoutContract = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Contracts
            .addCase(fetchSalesContracts.pending, (state) => {
                state.isLoading = true; state.error = null;
            })
            .addCase(fetchSalesContracts.fulfilled, (state, action) => {
                state.isLoading = false; state.items = action.payload;
            })
            .addCase(fetchSalesContracts.rejected, (state, action) => {
                state.isLoading = false; state.error = action.payload as string;
            })
            
            // Get Contract By Id
            .addCase(getSalesContractById.pending, (state) => {
                state.isLoading = true; state.error = null;
            })
            .addCase(getSalesContractById.fulfilled, (state, action) => {
                state.isLoading = false; state.currentContract = action.payload;
            })
            .addCase(getSalesContractById.rejected, (state, action) => {
                state.isLoading = false; state.error = action.payload as string;
            })
            
            // Fetch SO Without Contract
            .addCase(fetchSOWithoutContractList.pending, (state) => {
                state.isLoading = true; state.error = null;
            })
            .addCase(fetchSOWithoutContractList.fulfilled, (state, action) => {
                state.isLoading = false; state.soWithoutContracts = action.payload;
            })
            .addCase(fetchSOWithoutContractList.rejected, (state, action) => {
                state.isLoading = false; state.error = action.payload as string;
            })

            // Get SO Without Contract By Id
            .addCase(getSOWithoutContractById.pending, (state) => {
                state.isLoading = true; state.error = null;
            })
            .addCase(getSOWithoutContractById.fulfilled, (state, action) => {
                state.isLoading = false; state.currentSOWithoutContract = action.payload;
            })
            .addCase(getSOWithoutContractById.rejected, (state, action) => {
                state.isLoading = false; state.error = action.payload as string;
            })
            
            // Create Contract
            .addCase(createSalesContract.pending, (state) => {
                state.isLoading = true; state.error = null;
            })
            .addCase(createSalesContract.fulfilled, (state, action) => {
                state.isLoading = false; 
                state.items.unshift(action.payload);
                // Also remove from soWithoutContracts
                state.soWithoutContracts = state.soWithoutContracts.filter(so => so.id_so !== action.payload.id_so);
            })
            .addCase(createSalesContract.rejected, (state, action) => {
                state.isLoading = false; state.error = action.payload as string;
            })
            
            // Update Contract
            .addCase(updateSalesContract.pending, (state) => {
                state.isLoading = true; state.error = null;
            })
            .addCase(updateSalesContract.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.items.findIndex(s => s.id_sales_contract === action.payload.id_sales_contract);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
                if (state.currentContract?.id_sales_contract === action.payload.id_sales_contract) {
                    state.currentContract = action.payload;
                }
            })
            .addCase(updateSalesContract.rejected, (state, action) => {
                state.isLoading = false; state.error = action.payload as string;
            });
    }
});

export const { clearCurrentContract, clearCurrentSOWithoutContract, clearError } = salescontractSlice.actions;
export default salescontractSlice.reducer;
