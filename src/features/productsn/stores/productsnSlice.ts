import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductSn, ProductDataBarang } from '../types/productsn.types';

interface ProductsnState {
    productSns: ProductSn[];
    supportData: ProductDataBarang[];
    isLoading: boolean;
    error: string | null;
}

const initialState: ProductsnState = {
    productSns: [],
    supportData: [],
    isLoading: false,
    error: null,
};

const productsnSlice = createSlice({
    name: 'productsn',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
            state.error = null;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        setProductSns: (state, action: PayloadAction<ProductSn[]>) => {
            state.productSns = action.payload;
            state.isLoading = false;
            state.error = null;
        },
        setSupportData: (state, action: PayloadAction<ProductDataBarang[]>) => {
            state.supportData = action.payload;
        },
        addProductSn: (state, action: PayloadAction<ProductSn>) => {
            state.productSns.unshift(action.payload);
            state.isLoading = false;
        },
        updateProductSn: (state, action: PayloadAction<ProductSn>) => {
            const index = state.productSns.findIndex(a => a.id_product_sn === action.payload.id_product_sn);
            if (index !== -1) {
                state.productSns[index] = action.payload;
            }
            state.isLoading = false;
        },
        deleteProductSn: (state, action: PayloadAction<string | number>) => {
            state.productSns = state.productSns.filter(a => String(a.id_product_sn) !== String(action.payload));
            state.isLoading = false;
        }
    }
});

export const {
    setLoading,
    setError,
    setProductSns,
    setSupportData,
    addProductSn,
    updateProductSn,
    deleteProductSn
} = productsnSlice.actions;

export default productsnSlice.reducer;
