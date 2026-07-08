import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Supplier } from '../types/suppliers.types';
import { DUMMY_SUPPLIERS } from '../data/suppliers.data';

interface SuppliersState {
    suppliers: Supplier[];
    isLoading: boolean;
    error: string | null;
}

const initialState: SuppliersState = {
    suppliers: DUMMY_SUPPLIERS,
    isLoading: false,
    error: null,
};

export const suppliersSlice = createSlice({
    name: 'suppliers',
    initialState,
    reducers: {
        setSuppliers: (state, action: PayloadAction<Supplier[]>) => {
            state.suppliers = action.payload;
        },
        addSupplier: (state, action: PayloadAction<Supplier>) => {
            state.suppliers.push(action.payload);
        },
        updateSupplier: (state, action: PayloadAction<Supplier>) => {
            const index = state.suppliers.findIndex(s => s.id_suppliers === action.payload.id_suppliers);
            if (index !== -1) {
                state.suppliers[index] = action.payload;
            }
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        }
    }
});

export const { setSuppliers, addSupplier, updateSupplier, setLoading, setError } = suppliersSlice.actions;
export default suppliersSlice.reducer;
